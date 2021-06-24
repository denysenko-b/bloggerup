const User = require('../models/user.model');
const InstagramService = require('../services/instagram.service');

const minAccountReq = require('../config/minAccountRequirements.config');
const referralRewards = require('../config/referralRewards.confg');
const notificationsConfig = require('../config/notifications.config');

class UserController {

    create = async (userId, firstName, chatId, tgUsername, prevMessage, referralParent) => {
        try {
            const user = await User.findOne({
                userId
            });

            if (user) {
                user.prevMessage = prevMessage;
                user.chatId = chatId;
                if (firstName) user.firstName = firstName;
                if (tgUsername) user.tgUsername = tgUsername;
                await user.save();
                return;
            }

            const newUser = new User({
                userId,
                prevMessage,
                chatId,
                prevMessage,
                tgUsername,
                firstName
            })

            console.log(`New user has been created. His name is: ${firstName}`)

            if (!referralParent) newUser.gotReferralReward = true;
            else {
                const trueReferral = await User.findOne({
                    userId: referralParent
                }).select('_id');
                if (trueReferral) {
                    newUser.referralParent = referralParent;
                }
            }

            // console.log(referralId, userId);
            // if (referralId && (referralId !== userId)) {

            //     const referral = await User.findOne({
            //         userId: referralId
            //     }).select('firstName points chatId');

            //     newUser.referralParent = referralId;
            //     newUser.points += referralRewards.points;

            //     referral.points += referralRewards.points;

            //     await newUser.save();
            //     await referral.save();

            //     const {
            //         firstName,
            //         chatId: rechatId
            //     } = referral;

            //     return {
            //         firstName,
            //         rechatId
            //     }
            // }

            await newUser.save();
        } catch (e) {
            console.log(e);
            throw 'e';
        }
    }

    updateAccountUsername = async (userId, userData) => {
        if (!userData) throw 'not_found';

        const {
            pk: instId,
            is_private,
            full_name,
            follower_count: followers,
            media_count: mediaCount,
            has_anonymous_profile_picture,
            profile_pic_url,
            username
        } = userData;

        if (is_private) throw 'is_private';

        if (has_anonymous_profile_picture) throw 'account_must_have_an_avatar'


        const {
            minPhotos,
            minFollowers
        } = minAccountReq;

        if (followers < minFollowers) throw 'few_subscribers';
        if (mediaCount < minPhotos) throw 'few_media';

        try {
            await User.findOneAndUpdate({
                userId
            }, {
                accountUsername: username,
                accountId: instId
            });

            return {
                profile_pic_url,
                full_name
            };
        } catch (e) {
            if (e.codeName === 'DuplicateKey')
                throw 'already_exists'

            console.log(e);
        }
    }

    switchNotifications = async (userId) => {
        const user = await User.findOne({
            userId
        });

        user.notifications = !user.notifications;
        await user.save();

        return user.notifications;
    }

    getPoints = async (userId) =>
        (await User.findOne({
            userId
        }).select('points')).points;

    payForTask = async (userId, points) => {
        const user = await User.findOne({
            userId
        }).select('points');
        user.points -= points;

        if (user.points < 0) throw 'not_enought_points';

        await user.save();
    }

    getUsersWithEnabledNotifications = async (count, chatId) => {
        const users = await User.aggregate([{
            $sample: {
                size: Math.ceil(count * notificationsConfig.userCountPercent)
            }
        }, {
            $match: {
                notifications: true,
                banned: false,
                prevMessage: null,
                chatId: {
                    $ne: chatId
                },
                lastActivity: {
                    $lte: new Date(Date.now() - notificationsConfig.absenseTime * 1000 * 60)
                },
                lastTaskNotificationDate: {
                    $lte: new Date(Date.now() - notificationsConfig.timeSinceLastTaskNotification * 1000 * 60 * 60)
                }
            }
        }, {
            $project: {
                chatId: 1
            }
        }])

        setTimeout(() => this.updateLastTaskNotificationDate(users), 0);
        return users;
    }

    updateLastTaskNotificationDate = users => users.forEach(async ({
        _id
    }) => {
        try {
            await User.findByIdAndUpdate(_id, {
                lastTaskNotificationDate: new Date(Date.now())
            })
        } catch (e) {
            console.log(e);
        }
    })

    getReferralData = async (userId) => User.findOne({
        userId
    }).select('chatId firstName points gotReferralReward')

    getCompleted = async (userId) => (await User.findOne({
        userId
    }).select('completed')).completed;

    getUserData = (userId, firstName, tgUsername, lastActivity) => User.findOneAndUpdate({
        userId
    }, {
        firstName,
        tgUsername,
        lastActivity
    }).select('accountId accountUsername points prevMessage banned chatId gotReferralReward referralParent lastActivity lastActivityInst')

    getPrevMessage = async (userId) => (await User.findOne({
        userId
    }).select('prevMessage')).prevMessage;
    setPrevMessage = (userId, prevMessage) => User.findOneAndUpdate({
        userId
    }, {
        prevMessage
    });
    clearPrevMessage = (userId) => this.setPrevMessage(userId, null);
}

module.exports = new UserController();
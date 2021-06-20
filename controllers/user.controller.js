const User = require('../models/user.model');
const InstagramService = require('../services/instagram.service');

const minAccountReq = require('../config/minAccountRequirements.config');
const referralRewards = require('../config/referralRewards.confg');

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
                firstName,
                referralParent
            })

            if (!referralParent) newUser.gotReferralReward = true;


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

    updateAccountUsername = async (userId, username) => {

        const userData = await InstagramService.getUserByUsername(username);
        if (!userData) throw 'not_found';

        const {
            pk: instId,
            is_private,
            full_name,
            follower_count: followers,
            media_count: mediaCount,
            has_anonymous_profile_picture,
            profile_pic_url
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

    getUsersWithEnabledNotifications = (size, chatId) => User.aggregate([{
        $sample: {
            size
        }
    }, {
        $match: {
            notifications: true,
            banned: false,
            prevMessage: null,
            chatId: {
                $ne: chatId
            }
        }
    }, {
        $project: {
            chatId: 1,
            _id: 0
        }
    }])

    getReferralParentData = async (userId) => User.findOne({userId}).select('chatId firstName points')

    getCompleted = async (userId) => (await User.findOne({
        userId
    }).select('completed')).completed;

    getUserData = (userId, firstName, tgUsername) => User.findOneAndUpdate({
        userId
    }, {
        firstName,
        tgUsername
    }).select('accountId points prevMessage banned chatId gotReferralReward referralParent')

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
const User = require('../models/user.model');
const InstagramService = require('../services/instagram.service');

const minAccountReq = require('../config/minAccountRequirements.config');

class UserController {

    create = async (userId, firstName, chatId, tgUsername, prevMessage) => {
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

                return false;
            }
            await User.create({
                userId,
                prevMessage,
                chatId,
                prevMessage,
                tgUsername,
                firstName
            });
            return true;
        } catch (e) {
            console.log(e);
            throw 'e';
        }
    }

    updateAccountUsername = async (userId, username) => {

        const userData = await InstagramService.checkUser(username);
        if (!userData) throw 'not_found';

        const {
            id: instId,
            is_private,
            full_name,
            followers,
            mediaCount
        } = userData;

        if (is_private) throw 'is_private';


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

            return full_name;
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

    getCompleted = async (userId) => (await User.findOne({
        userId
    }).select('completed')).completed;

    getUserData = async (userId) => await User.findOne({
        userId
    }).select('accountUsername accountId points referralsCount prevMessage')

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
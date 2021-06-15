const User = require('../models/user.model');
const InstagramService = require('../../services/instagram.service');

class UserController {
    create = async (userId) => {
        try {
            const user = await this.get(userId);

            if (user) return {
                user,
                newUser: false
            };

            return {
                user: await User.create({
                    userId
                }),
                newUser: true
            };

        } catch (e) {
            console.error(e);
            return null;
        }
    }

    updateAccount = async (userId, username) => {
        try {
            const userId = await InstagramService.getUserId(username);

            return await User.findOneAndUpdate({
                userId
            }, {
                accountUsername: username,
                accountId: userId
            })
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    get = async (userId) => {
        try {
            return await User.findOne({
                userId
            });
        } catch (e) {
            console.error(e);
            return null;
        }
    }
}

module.exports = new UserController();
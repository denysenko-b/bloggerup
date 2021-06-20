const Texts = require('../texts');
const UserController = require('../controllers/user.controller');


class Middlewares {

    checkUser = async (ctx, next) => {
        const {
            from: {
                id: userId,
                first_name,
                username
            },
            chat: {
                id: chatId
            }
        } = ctx;

        ctx.userData = await UserController.getUserData(userId, first_name, username);


        if (ctx.userData?.banned) {
            const replyText = Texts.reply.messages.banned;

            return ctx.reply(replyText);
        }
        return next();
    }
}

module.exports = new Middlewares();
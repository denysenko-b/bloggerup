const Texts = require('../texts');
const UserController = require('../controllers/user.controller');
const WarningsConfig = require('../config/warnings.config');
const CommandController = require('../controllers/command.controller');

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

        const newActivity = Date.now();
        ctx.userData = await UserController.getUserData(userId, first_name, username, newActivity);

        if (ctx.userData) {
            const {
                banned,
                lastActivity,
                lastActivityInst
            } = ctx.userData;
            const deltaTime = (newActivity - lastActivity) / 1000;
            ctx.deltaInstTime = (newActivity - lastActivityInst) / 1000;

            const replyText = Texts.reply.messages.ban;

            if (deltaTime < WarningsConfig.minTimeDelay) {
                const {message_id} = await ctx.reply(replyText.warnings[0]);
                
                return setTimeout(() => {
                    ctx.tg.deleteMessage(chatId, message_id);
                }, WarningsConfig.warnDuration*1000)
            }

            if (banned) {
                return ctx.reply(replyText.finnaly);
            }
        }

        return next();
    }

    isNewUser = (ctx, next) => {
        if (!ctx.userData) {
            return CommandController.start(ctx);
        }
    
        return next();
    }
}

module.exports = new Middlewares();
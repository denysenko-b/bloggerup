const UserController = require('./user.controller');
const TaskController = require('./task.controller');

const validator = require('../validators');

const Texts = require('../texts');

const {
    SelectTaskTypeInlineKeyboard
} = require('../keyboards');



class MessageController {

    constructor() {

        this.keyboardsMessages = Texts.keyboards;
        this.replyMessages = Texts.reply.messages;
    }

    regNewInstAccount = async (ctx, userId, username) => {
        const replyText = this.replyMessages.newInstAccount;

        ctx.reply(replyText.check);

        if (validator.isInstagramUsername(username)) {
            UserController.updateAccountUsername(userId, username)
                .then(async (full_name) => {
                    await UserController.clearPrevMessage(userId);
                    ctx.reply(replyText.successfulReg(full_name));
                })
                .catch(e => {
                    switch (e) {
                        case 404:
                            ctx.reply(replyText.notFound);
                            break;

                        case 'is_private':
                            ctx.reply(replyText.isPrivate);
                            break;

                        case 'already_exists':
                            ctx.reply(replyText.alreadyExists);
                            break;

                        case 'few_media':
                            ctx.reply(replyText.fewMedia);
                            break;

                        case 'few_subscribers':
                            ctx.reply(replyText.fewSubscribers);
                            break;

                        default:
                            ctx.reply(this.replyMessages.error())
                            break;
                    }
                })
        } else {
            return ctx.reply(replyText.incorrect);
        }
    }

    giveTask = async (ctx, userId) => {
        const replyText = this.replyMessages.tasks.giveTask;
        ctx.reply(replyText.about, SelectTaskTypeInlineKeyboard);
    }

    getAvaliableTasks = async (ctx, userId) => {
        const replyText = this.replyMessages.tasks.getAvaliableTasks;
        TaskController.getAvaliableTasks()
            .then(() => {

            })
            .catch(() => {

            })
    }

    checkBalance = async (ctx, userId) => {

        const replyText = this.replyMessages.tasks.checkBalance;

        const points = await UserController.getPoints(userId);

        ctx.reply(replyText.balance(points));
    }

    buyPoints = async (ctx, userId) => {

    }

    messageListener = async ctx => {
        const {
            message,
            from: {
                id: userId
            }
        } = ctx;

        const {
            text
        } = message;

        const prevMessage = await UserController.getPrevMessage(userId);


        if (prevMessage) {
            if (prevMessage === 'reg') return this.regNewInstAccount(ctx, userId, text);
        } else {
            const {
                menu
            } = this.keyboardsMessages;

            for (const command in menu) {
                if (text.includes(menu[command])) return this[command](ctx, userId);
            }
        }

        return ctx.reply(this.replyMessages.iDontUnderstand);
    }





    createLikeTask = async (ctx, userId) => {
        ctx.reply('yes');
    }

    callbackQueryListener = async ctx => {
        const {
            callbackQuery: {
                data
            },
            from: {
                id: userId
            }
        } = ctx;

        const {
            giveTask
        } = this.keyboardsMessages;

        if (data === giveTask.likes.callback_data) return this.createLikeTask(ctx, userId);
    }
}

module.exports = new MessageController();
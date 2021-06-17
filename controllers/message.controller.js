const UserController = require('./user.controller');
const TaskController = require('./task.controller');

const validator = require('../validators');

const PointsRate = require('../config/pointsRate.config');

const Texts = require('../texts');

const {
    SelectTaskTypeInlineKeyboard
} = require('../keyboards');

const keyboardsMessages = Texts.keyboards;
const replyMessages = Texts.reply.messages;


class MessageController {

    regNewInstAccount = async (ctx, userId, username, userData) => {

        const replyText = replyMessages.newInstAccount;
        const messageId = ctx.message.message_id;
        await ctx.reply(replyText.check);



        try {
            if (!validator.isInstagramUsername(username)) throw 'incorrect';

            const full_name = await UserController.updateAccountUsername(userId, username);
            await UserController.clearPrevMessage(userId);
            ctx.reply(replyText.successfulReg(full_name || username));
        } catch (e) {
            let message = '';

            switch (e) {
                case 'incorrect':
                    message = replyText.incorrect;
                    break;

                case 'not_found':
                    message = replyText.notFound;
                    break;

                case 'is_private':
                    message = replyText.isPrivate;
                    break;

                case 'already_exists':
                    message = replyText.alreadyExists;
                    break;

                case 'few_media':
                    message = replyText.fewMedia;
                    break;

                case 'few_subscribers':
                    message = replyText.fewSubscribers;
                    break;

                default:
                    message = replyMessages.error()
                    break;
            }

            return ctx.reply(message, {
                reply_to_message_id: messageId
            });
        }
    }

    giveTask = async (ctx, userId, userData) => {
        const replyText = replyMessages.tasks.giveTask;
        ctx.reply(replyText.about, SelectTaskTypeInlineKeyboard);
    }

    getAvaliableTasks = async (ctx, userId, userData) => {
        const replyText = replyMessages.tasks.getAvaliableTasks;
        TaskController.getAvaliableTasks()
            .then(() => {

            })
            .catch(() => {

            })
    }

    checkBalance = async (ctx, userId, {
        points
    }) => {

        const replyText = replyMessages.tasks.checkBalance;

        ctx.reply(replyText.balance(points));
    }

    buyPoints = async (ctx, userId, userData) => {

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

        const userData = await UserController.getUserData(userId);
        const {
            prevMessage,
            accountId,
            points
        } = userData;

        const {
            menu
        } = keyboardsMessages;

        const reservedMessages = {
            ...menu
        }

        for (const command in reservedMessages) {
            if (text === reservedMessages[command]) {

                if (!accountId) {
                    await UserController.setPrevMessage(userId, 'reg');
                    return ctx.reply(replyMessages.newInstAccount.firstCompleteTheRegistration);
                };

                if (prevMessage) {
                    await UserController.clearPrevMessage(userId);
                }
                return this[command](ctx, userId, userData)
            };
        }

        if (prevMessage === 'reg') return this.regNewInstAccount(ctx, userId, text);
        if (prevMessage === 'points_for_followers') return this.callculateCost(ctx, text, PointsRate.pointsToFollowers, 'followers');

        return ctx.reply(replyMessages.iDontUnderstand);
    }


    wait = seconds => new Promise(resolve => setTimeout(() => resolve(), seconds * 1000))

    sendFollowersTaskInfo = async (ctx, userId) => {
        const replyText = replyMessages.tasks.giveTask.followers;
        // const messageId = ctx.callbackQuery.message.message_id;

        await ctx.editMessageText(replyText.about, {});
        await this.wait(3);
        await ctx.reply(replyText.showCurrentBalance(1000));
        await this.wait(2);
        await ctx.reply(replyText.pointsRate);
        await UserController.setPrevMessage(userId, 'points_for_followers')
        await this.wait(3);
        return ctx.reply(replyText.waitFollowersCount);
    }

    callculateCost = async (ctx, count, [a, b], taskType) => {
        if (!validator.isNumber(count)) {
            return replyText.errors.notANumber;
        }

        const cost = count * b / a;

        return ctx.reply(replyMessages.tasks.giveTask[taskType].showCost(cost), {
            reply_to_message_id: ctx.message.message_id
        });
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
        } = keyboardsMessages;

        // if (data === giveTask.likes.callback_data) return this.createLikeTask(ctx, userId);
        if (data === giveTask.followers.callback_data) return this.sendFollowersTaskInfo(ctx, userId);
    }
}

module.exports = new MessageController();
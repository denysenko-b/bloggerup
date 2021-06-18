const UserController = require('./user.controller');
const TaskController = require('./task.controller');

const validator = require('../validators');

const PointsRate = require('../config/pointsRate.config');

const Texts = require('../texts');

const {
    SelectTaskTypeInlineKeyboard,
    DoYouAgreeKeyboard,
    GetPointsKeyboard
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

    getAvaliableTasks = async (ctx, userId, {accountId}) => {
        const replyText = replyMessages.tasks.getAvaliableTasks;
        await ctx.reply(replyText.check);


        try {

            await TaskController.getAvaliableTasks(userId, accountId);

        } catch (e) {
            let message = '';

            switch (e) {
                case 'not_avaliable':
                    message = replyText.notAvaliableNow
                    break;

                default:
                    console.log(e);
                    message = replyText.unhandledError
                    break;
            }

            ctx.reply(message);
        }
    }

    checkBalance = async (ctx, userId, {
        points
    }) => {

        const replyText = replyMessages.tasks.checkBalance;

        ctx.reply(replyText.balance(points), GetPointsKeyboard);
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
        if (prevMessage === 'points_for_followers') return this.callculateCost(ctx, text, PointsRate.pointsToFollowers, points, 'followers', accountId);

        return ctx.reply(replyMessages.iDontUnderstand);
    }


    wait = seconds => new Promise(resolve => setTimeout(() => resolve(), seconds * 1000))

    sendFollowersTaskInfo = async (ctx, userId) => {
        const replyText = replyMessages.tasks.giveTask.followers;
        // const messageId = ctx.callbackQuery.message.message_id;

        await ctx.reply(replyText.about);
        // await this.wait(3);
        await ctx.reply(replyText.showCurrentBalance(1000));
        // await this.wait(2);
        await ctx.reply(replyText.pointsRate);
        await UserController.setPrevMessage(userId, 'points_for_followers')
        // await this.wait(3);
        return ctx.reply(replyText.waitFollowersCount);
    }

    callculateCost = async (ctx, count, [a, b], userPoints, taskType, accountId) => {
        let replyText = replyMessages.tasks.giveTask;
        const messageId = ctx.message.message_id;

        if (isNaN(count)) {
            return ctx.reply(replyText.errors.notANumber, {
                reply_to_message_id: messageId
            });
        }
        const cost = count * a / b;

        if (cost > userPoints) {
            return ctx.reply(replyText.errors.notEnoughPoints, {
                reply_to_message_id: messageId
            });
        }

        replyText = replyText[taskType];


        await UserController.clearPrevMessage(ctx.from.id);
        await ctx.reply(replyText.showCost(cost), {
            reply_to_message_id: messageId
        });

        const callback_data = [count, accountId];

        return ctx.reply(replyText.waitUserAgree, DoYouAgreeKeyboard('followers', callback_data));
    }

    createTask = async (ctx, userId, [count, data], taskType, [a, b]) => {

        const replyText = replyMessages.tasks.giveTask;

        const cost = count * a / b;

        try {
            const message = replyText[taskType];
            await TaskController.createTask(userId, taskType, data, count, cost);

            ctx.editMessageText(message.successfulAddTask, {});
        } catch (e) {
            let message = '';

            switch (e) {
                case 'not_enought_points':
                    message = replyText.errors.notEnoughPoints;
                    break;

                default:
                    console.log(e);
                    message = replyText.errors.errorWhileCreatingTask;
                    break;
            }

            ctx.editMessageText(message, {});
        }
    }

    cancel = async (ctx) => ctx.editMessageText(replyMessages.cancelQuery, {});

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
            // doYouAgree,
            // getPoints
        } = keyboardsMessages;

        // if (data === giveTask.likes.callback_data) return this.createLikeTask(ctx, userId);
        if (data === giveTask.followers.callback_data) return this.sendFollowersTaskInfo(ctx, userId);
        if (data === 'cancel') return this.cancel(ctx, userId);
        if (data === 'give_me_a_task') return this.getAvaliableTasks(ctx, userId);



        let [command, _data] = data.split('=');
        _data = JSON.parse(_data);

        if (command === 'cft') return this.createTask(ctx, userId, _data, 'followers', PointsRate.pointsToFollowers);
    }
}

module.exports = new MessageController();
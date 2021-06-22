const UserController = require('./user.controller');
const TaskController = require('./task.controller');
const InstagramService = require('../services/instagram.service');

const validator = require('../validators');

const PointsRate = require('../config/pointsRate.config');
const TasksConfig = require('../config/tasks.config');
const WarningsConfig = require('../config/warnings.config');

const Texts = require('../texts');

const {
    SelectTaskTypeInlineKeyboard,
    DoYouAgreeKeyboard,
    GetPointsKeyboard,
    CheckTheTaskIsOverKeyboard
} = require('../keyboards');

const keyboardsMessages = Texts.keyboards;
const replyMessages = Texts.reply.messages;


class MessageController {

    regNewInstAccount = async (ctx, userId, username, userData) => {

        const replyText = replyMessages.newInstAccount;
        const chatId = ctx.chat.id;

        const {
            message_id: prev_message_id
        } = await ctx.reply(replyText.check);

        try {
            if (!validator.isInstagramUsername(username)) throw 'incorrect';

            const instUserData = await InstagramService.getUserByUsername(ctx, username.toLowerCase());

            const asd = await UserController.updateAccountUsername(userId, instUserData);

            const {
                full_name,
                profile_pic_url
            } = asd;

            await UserController.clearPrevMessage(userId);
            await ctx.tg.deleteMessage(chatId, prev_message_id);

            const caption = replyText.successfulReg(full_name || username)

            return ctx.replyWithPhoto(profile_pic_url, {
                caption
            });
        } catch (e) {

            let message = '';

            switch (e) {

                case 'incorrect':
                    message = replyText.incorrect;
                    break;

                case 'many_requests':
                    message = replyText.manyRequests;
                    break;

                case 'not_found':
                    message = replyText.notFound;
                    break;

                case 'is_private':
                    message = replyText.isPrivate;
                    break;

                case 'account_must_have_an_avatar':
                    message = replyText.mustHaveAnAvatar;
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

                case 'service_is_unavaliabe':
                    message = replyMessages.instagramService.unavaliable;
                    break;

                default:
                    message = replyMessages.error()
                    break;
            }

            return ctx.tg.editMessageText(chatId, prev_message_id, null, message);
        }
    }

    giveTask = async (ctx, userId, {
        points
    }) => {
        const replyText = replyMessages.tasks.giveTask;

        if (points < TasksConfig.minPointsCount) return ctx.reply(replyText.errors.fewPoints);

        return ctx.reply(replyText.about, SelectTaskTypeInlineKeyboard);
    }

    sendFollowersTask = async (ctx, _data, prev_message_id, userAccountId) => {
        const chatId = ctx.chat.id;

        const replyText = replyMessages.tasks.getAvaliableTasks;

        const {
            data,
            _id
        } = _data;

        try {
            const {
                profile_pic_url,
                full_name,
                username
            } = await InstagramService.getUserById(ctx, data);

            const caption = replyMessages.tasks.getAvaliableTasks.followers.createTask(full_name, username);

            await ctx.tg.deleteMessage(chatId, prev_message_id);
            return ctx.replyWithPhoto(profile_pic_url, {
                caption,
                ...CheckTheTaskIsOverKeyboard([data, _id, 'f'])
            });
        } catch (e) {
            let message = '';

            switch (e) {
                case 'many_requests':
                    message = replyText.manyRequests;
                    break;

                case 'service_is_unavaliabe':
                    message = replyText.instagramServiceIsUnavaliable;
                    break;

                default:
                    console.log(e);
                    message = replyText.unhandledError;
                    break;
            }

            ctx.tg.editMessageText(chatId, prev_message_id, null, message);
        }
    }

    sendLikesTask = async (ctx) => {

    }

    getAvaliableTasks = async (ctx, userId, {
        accountId
    }) => {
        const replyText = replyMessages.tasks.getAvaliableTasks;
        const chatId = ctx.chat.id;
        const {
            message_id: prev_message_id
        } = await ctx.reply(replyText.check);
        let message = '';

        try {

            const avaliableTasks = await TaskController.getAvaliableTasks(userId, accountId);

            if (!avaliableTasks) message = replyText.notAvaliableNow;
            else {
                const {
                    taskType,
                    data,
                    _id
                } = avaliableTasks;

                switch (taskType) {
                    case 'followers':
                        return this.sendFollowersTask(ctx, {
                            data,
                            _id
                        }, prev_message_id, accountId);

                    case 'likes':
                        return this.sendLikesTask(ctx, {
                            data,
                            _id
                        }, prev_message_id);

                    default:
                        throw 'unhandled_error'
                }
            }

            // message = 'Не тикай сюди, це ще не працює))';

        } catch (e) {

            switch (e) {
                case 'not_avaliable':
                    message = replyText.notAvaliableNow
                    break;

                default:
                    console.log(e);
                    message = replyText.unhandledError
                    break;
            }

            // ctx.reply(message);
        }

        return ctx.tg.editMessageText(chatId, prev_message_id, null, message);
    }

    checkBalance = async (ctx, userId, {
        points
    }) => {

        const replyText = replyMessages.tasks.checkBalance;

        ctx.reply(replyText.balance(points), GetPointsKeyboard);
    }

    buyPoints = async (ctx, userId, userData) => {

    }

    messageListener = async (ctx) => {
        const {
            message,
            from: {
                id: userId
            }
        } = ctx;

        const {
            text
        } = message;

        const userData = ctx.userData;

        const {
            prevMessage,
            accountId,
            points,
            banned
        } = userData;

        if (banned) return ctx.reply(replyMessages.banned);

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
        if (prevMessage === 'create_followers_task') return this.callculateCost(ctx, text, PointsRate.pointsToFollowers, points, 'followers', accountId);

        return ctx.reply(replyMessages.iDontUnderstand);
    }


    wait = seconds => new Promise(resolve => setTimeout(() => resolve(), seconds * 1000))

    sendFollowersTaskInfo = async (ctx, userId) => {
        const replyText = replyMessages.tasks.giveTask.followers;
        // const messageId = ctx.callbackQuery.message.message_id;

        await ctx.editMessageText(replyText.about);
        // await this.wait(3);
        await ctx.reply(replyText.showCurrentBalance(1000));
        // await this.wait(2);
        await ctx.reply(replyText.pointsRate);
        await UserController.setPrevMessage(userId, 'create_followers_task')
        // await this.wait(3);
        return ctx.reply(replyText.waitFollowersCount);
    }

    callculateCost = async (ctx, count, [a, b], userPoints, taskType, data) => {
        let replyText = replyMessages.tasks.giveTask;
        const messageId = ctx.message.message_id;

        if (isNaN(count)) {
            return ctx.reply(replyText.errors.notANumber, {
                reply_to_message_id: messageId
            });
        }

        if (count < TasksConfig.minCount[taskType]) {
            return ctx.reply(replyText.errors.lessThenMinCount[taskType], {
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

        const callback_data = [count, data];

        return ctx.reply(replyText.waitUserAgree, DoYouAgreeKeyboard('followers', callback_data));
    }

    sendNotificationsAboutNewTask = async (ctx, chatId, count) => {
        const users = await UserController.getUsersWithEnabledNotifications(count, chatId);


        //TODO: remove this where the app will go out development
        {
            console.log(`Notifications.\nCreator: <${ctx.from.first_name}:${ctx.userData.accountUsername}>`)
            console.table(users);
        }

        users.forEach(({
            chatId
        }) => {
            try {
                const replyText = replyMessages.tasks.notifications;
                ctx.tg.sendMessage(chatId, replyText);
            } catch (e) {
                console.log(e);
            }
        })
    }

    createTask = async (ctx, userId, [count, data], taskType, [a, b]) => {

        const replyText = replyMessages.tasks.giveTask;

        const cost = count * a / b;

        try {
            const message = replyText[taskType];
            await TaskController.createTask(userId, taskType, data, count, cost);

            await ctx.editMessageText(message.successfulAddTask, {});

            return this.sendNotificationsAboutNewTask(ctx, ctx.chat.id, count);
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

    sendLikesTaskInfo = async (ctx, userId) => {
        ctx.editMessageText('Не тикай сюди, це ще не работає))')
    }

    cancel = async (ctx) => ctx.editMessageText(replyMessages.cancelQuery, {});


    checkTheFTaskIsOver = async (ctx, taskAccountId) => {
        const userFollowers = await InstagramService.getUserFollowers(ctx, taskAccountId);

        const {
            accountId
        } = ctx.userData;


        for (const follower of userFollowers) {
            const {
                pk
            } = follower;

            if (pk == accountId) {
                return true;
            }
        }

        return false;
    }

    checkTheLTaskIsOver = async (ctx, taskAccountId) => {


        return false;
    }

    sendReferralRewards = async (ctx, chatId, rechatId, firstName) => {

    }

    checkTheTaskIsOver = async (ctx, userId, [data, taskId, taskType]) => {
        // ctx.reply('In future update');

        const {
            message: {
                reply_markup: cacheReplyMarkup,
                caption: cacheCaption
            }
        } = ctx.callbackQuery;

        let replyText = replyMessages.tasks.getAvaliableTasks;
        let isOver = false;


        try {
            await ctx.editMessageCaption(replyText.check);

            switch (taskType) {
                case 'f':
                    isOver = await this.checkTheFTaskIsOver(ctx, data);
                    replyText = replyText.followers;
                    break;

                case 'l':
                    isOver = await this.checkTheLTaskIsOver(ctx, data);
                    replyText = replyText.likes;
                    break;

                default:
                    throw 'Incorrect task type';
            }
            if (!isOver) throw 'task_isnot_completed';

            await TaskController.markCompleted(userId, taskId);

            await ctx.editMessageCaption(replyText.successfullyExecuted);

            setTimeout(() => this.getAvaliableTasks(ctx, userId, ctx.userData), 0);

            const {
                referralParent,
                gotReferralReward
            } = ctx.userData;
            if (referralParent && !gotReferralReward) {
                this.sendReferralRewards;
            }

        } catch (e) {
            let message = '';

            switch (e) {
                case 'task_isnot_completed':
                    message = replyText.notCompleted;
                    break;

                case 'Incorrect task type':
                    message = replyText.unhandledError;
                    break;

                case 'service_is_unavaliabe':
                    message = replyText.instagramServiceIsUnavaliable;
                    break;

                default:
                    message = replyText.unhandledError;
                    break;
            }

            await ctx.editMessageCaption(message);

            setTimeout(() => {
                ctx.editMessageCaption(cacheCaption);
                ctx.editMessageReplyMarkup(cacheReplyMarkup)
            }, WarningsConfig.warnDuration * 1000);
        }
    }

    becomeAReferral = async (ctx, userId) => {
        const replyText = replyMessages.referralRewards.becomeAReferral(userId);
        ctx.reply(replyText);
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
            // doYouAgree,
            // getPoints
        } = keyboardsMessages;

        const userData = ctx.userData;


        if (data === giveTask.likes.callback_data) return this.sendLikesTaskInfo(ctx, userId);
        if (data === giveTask.followers.callback_data) return this.sendFollowersTaskInfo(ctx, userId);
        if (data === 'cancel') return this.cancel(ctx, userId);
        if (data === 'give_me_a_task') return this.getAvaliableTasks(ctx, userId, userData);
        if (data === 'become_a_referral') return this.becomeAReferral(ctx, userId);



        let [command, _data] = data.split('=');
        _data = JSON.parse(_data);

        if (command === 'cft') return this.createTask(ctx, userId, _data, 'followers', PointsRate.pointsToFollowers);
        if (command === 'cttio') return this.checkTheTaskIsOver(ctx, userId, _data);
    }
}

module.exports = new MessageController();
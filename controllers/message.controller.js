const UserController = require('./user.controller');
const TaskController = require('./task.controller');
const InstagramService = require('../services/instagram.service');

const validator = require('../validators');

const PointsRate = require('../config/pointsRate.config');
const TasksConfig = require('../config/tasks.config');
const NotificationsConfig = require('../config/notifications.config');
const ReferralRewards = require('../config/referralRewards.confg');

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

            const {
                full_name,
                profile_pic_url
            } = await UserController.updateAccountUsername(userId, username.toLowerCase());
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
            } = await InstagramService.getUserById(data);

            const caption = replyMessages.tasks.getAvaliableTasks.followers.createTask(full_name, username);

            await ctx.tg.deleteMessage(chatId, prev_message_id);
            return ctx.replyWithPhoto(profile_pic_url, {
                caption,
                ...CheckTheTaskIsOverKeyboard('followers', [data, _id])
            });
        } catch (e) {
            let message = '';

            switch (e) {

                default:
                    console.log(e);
                    return ctx.reply(replyText.unhandledError);
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
        const {
            userCountPercent
        } = NotificationsConfig;
        const userCount = Math.floor(count * userCountPercent);

        const users = await UserController.getUsersWithEnabledNotifications(userCount, chatId);

        console.log(users);

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

    checkFollowersTask = async (ctx, userId, [taskAccountId, taskId]) => {
        ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
        ctx.reply('In future update');
        // const taskUserFollowers = await InstagramService.getUserFollowers(taskAccountId);

        // const {
        //     accountId
        // } = ctx.userData;

        // const replyText = replyMessages.tasks.getAvaliableTasks.followers.check;

        // // console.log(taskUserFollowers);
        // try {
        //     for (const follower of taskUserFollowers) {
        //         const {
        //             pk
        //         } = follower;

        //         if (pk == accountId) {
        //             const completed = await TaskController.markCompleted(userId, taskId);



        //             if (completed.length === 0 && !ctx.userData.gotReferralReward) {
        //                 const {referralParent} = ctx.userData;
        //                 const {first_name} = ctx.from;
        //                 const referralUser = await UserController.getReferralParentData(referralParent);
        //                 const {chatId: rechatId, firstName: refirstName} = referralUser;

        //                 const rereplyText = replyMessages.referralRewards;

        //                 ctx.userData.points += ReferralRewards.points;
                        

        //                 await ctx.userData.save();
        //                 await ctx.reply(rereplyText.child(refirstName));


        //                 await referralUser.save();
        //                 return ctx.tg.sendMesage(rechatId, rereplyText.parent(first_name));
        //             }
        //         };
        //     }
        // } catch (e) {

        // }
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
        if (command === 'cftc') return this.checkFollowersTask(ctx, userId, _data);
    }
}

module.exports = new MessageController();
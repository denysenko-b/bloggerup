const UserController = require("./user.controller");
const TaskController = require("./task.controller");
const ProblemController = require("./problem.controller");

const InstagramService = require("../services/instagram.service");

const validator = require("../validators");

const PointsRate = require("../config/pointsRate.config");
const TasksConfig = require("../config/tasks.config");
const WarningsConfig = require("../config/warnings.config");
const ReferralRewards = require("../config/referralRewards.confg");
const HelperConfig = require("../config/helper.config");

const Texts = require("../texts");

const {
    SelectTaskTypeInlineKeyboard,
    DoYouAgreeKeyboard,
    GetPointsKeyboard,
    CheckTheTaskIsOverKeyboard,
    SupportSendAddMaterialKeyboard,
    SupportTheProblemIsSuccessfulyCompleted,
} = require("../keyboards");

const keyboardsMessages = Texts.keyboards;
const replyMessages = Texts.reply.messages;

class MessageController {
    regNewInstAccount = async (ctx, userId, username, userData) => {
        const replyText = replyMessages.newInstAccount;
        const chatId = ctx.chat.id;

        const { message_id: prev_message_id } = await ctx.reply(
            replyText.check
        );

        try {
            if (!validator.isInstagramUsername(username)) throw "incorrect";

            const instUserData = await InstagramService.getUserByUsername(
                ctx,
                username.toLowerCase()
            );

            const { full_name, profile_pic_url } =
                await UserController.updateAccountUsername(
                    userId,
                    instUserData
                );

            await UserController.clearPrevMessage(userId);
            await ctx.tg.deleteMessage(chatId, prev_message_id);

            const caption = replyText.successfulReg(full_name || username);

            return ctx.replyWithPhoto(profile_pic_url, {
                caption,
            });
        } catch (e) {
            let message = "";

            switch (e) {
                case "incorrect":
                    message = replyText.incorrect;
                    break;

                case "many_requests":
                    message = replyText.manyRequests;
                    break;

                case "not_found":
                    message = replyText.notFound;
                    break;

                case "is_private":
                    message = replyText.isPrivate;
                    break;

                case "account_must_have_an_avatar":
                    message = replyText.mustHaveAnAvatar;
                    break;

                case "already_exists":
                    message = replyText.alreadyExists;
                    break;

                case "few_media":
                    message = replyText.fewMedia;
                    break;

                case "few_subscribers":
                    message = replyText.fewSubscribers;
                    break;

                case "service_is_unavaliabe":
                    message = replyMessages.instagramService.unavaliable;
                    break;

                default:
                    console.log(e);
                    message = replyMessages.error();
                    break;
            }

            return ctx.tg.editMessageText(
                chatId,
                prev_message_id,
                null,
                message
            );
        }
    };

    giveTask = async (ctx, userId, { points }) => {
        const replyText = replyMessages.tasks.giveTask;

        if (points < TasksConfig.minPointsCount)
            return ctx.reply(replyText.errors.fewPoints);

        return ctx.reply(replyText.about, SelectTaskTypeInlineKeyboard);
    };

    sendFollowersTask = async (ctx, _data, prev_message_id, userAccountId) => {
        const chatId = ctx.chat.id;

        const replyText = replyMessages.tasks.getAvaliableTasks;

        const { data, _id } = _data;

        try {
            const { profile_pic_url, full_name, username } =
                await InstagramService.getUserById(ctx, data);

            const caption =
                replyMessages.tasks.getAvaliableTasks.followers.createTask(
                    full_name,
                    username
                );

            await ctx.tg.deleteMessage(chatId, prev_message_id);
            return ctx.replyWithPhoto(profile_pic_url, {
                caption,
                ...CheckTheTaskIsOverKeyboard([data, _id, "f"]),
            });
        } catch (e) {
            let message = "";

            switch (e) {
                case "many_requests":
                    message = replyText.manyRequests;
                    break;

                case "service_is_unavaliabe":
                    message = replyText.instagramServiceIsUnavaliable;
                    break;

                default:
                    console.log(e);
                    message = replyText.unhandledError;
                    break;
            }

            ctx.tg.editMessageText(chatId, prev_message_id, null, message);
        }
    };

    sendLikesTask = async (
        ctx,
        { data, _id },
        prev_message_id,
        userAccountId
    ) => {
        const chatId = ctx.chat.id;

        const replyText = replyMessages.tasks.getAvaliableTasks;

        const [shortUrl, mediaId] = data.split("&");

        try {
            // await ctx.tg.deleteMessage(chatId, prev_message_id);
            await ctx.tg.editMessageText(
                chatId,
                prev_message_id,
                null,
                replyText.likes.createTask(shortUrl),
                CheckTheTaskIsOverKeyboard([mediaId, _id, "l"])
            );
        } catch (e) {
            let message = "";

            switch (e) {
                default:
                    console.log(e);
                    message = replyText.unhandledError;
                    break;
            }

            ctx.tg.editMessageText(chatId, prev_message_id, null, message);
        }
    };

    getAvaliableTasks = async (ctx, userId, { accountId }) => {
        const replyText = replyMessages.tasks.getAvaliableTasks;
        const chatId = ctx.chat.id;
        const { message_id: prev_message_id } = await ctx.reply(
            replyText.check
        );
        let message = "";

        try {
            const avaliableTasks = await TaskController.getAvaliableTasks(
                userId,
                accountId
            );

            if (!avaliableTasks) message = replyText.notAvaliableNow;
            else {
                const { taskType, data, _id } = avaliableTasks;

                switch (taskType) {
                    case "followers":
                        return this.sendFollowersTask(
                            ctx,
                            {
                                data,
                                _id,
                            },
                            prev_message_id,
                            accountId
                        );

                    case "likes":
                        return this.sendLikesTask(
                            ctx,
                            {
                                data,
                                _id,
                            },
                            prev_message_id
                        );

                    default:
                        throw "unhandled_error";
                }
            }

            // message = 'Не тикай сюди, це ще не працює))';
        } catch (e) {
            switch (e) {
                case "not_avaliable":
                    message = replyText.notAvaliableNow;
                    break;

                default:
                    console.log(e);
                    message = replyText.unhandledError;
                    break;
            }

            // ctx.reply(message);
        }

        return ctx.tg.editMessageText(chatId, prev_message_id, null, message);
    };

    checkBalance = async (ctx, userId, { points }) => {
        const replyText = replyMessages.tasks.checkBalance;

        ctx.reply(replyText.balance(points), GetPointsKeyboard);
    };

    buyPoints = async (ctx, userId, userData) => {};

    sendUserProblem = async (ctx, message, problemId) => {
        const { id: userId, username, first_name: firstName } = ctx.from;
        const { id: chatId } = ctx.chat;

        const replyText = replyMessages.support;
        try {
            const problem = replyText.problem(
                problemId,
                firstName,
                username,
                userId,
                chatId,
                message
            );

            await ctx.tg.sendMessage("1328545502", problem, {
                parse_mode: "html",
                ...SupportTheProblemIsSuccessfulyCompleted(problemId, chatId),
            });
            await UserController.clearPrevMessage(userId);
        } catch (e) {
            console.log(e);
        }
    };

    createUserProblem = async (ctx, message) => {
        const { chatId: helperChatId } = HelperConfig;

        const { id: chatId } = ctx.chat;

        const replyText = replyMessages.support;

        const { prevMessage } = ctx.userData;

        const { message_id } = ctx.message;

        const { id: userId } = ctx.from;

        let problemId;

        try {
            if (prevMessage.includes("=")) {
                let [, _id, message] = ctx.userData.prevMessage.split("=");
                problemId = _id;

                ctx.tg.editMessageReplyMarkup(chatId, message_id - 1, null, {});

                if (ctx.message.photo || ctx.message.video) {
                    await ctx.forwardMessage(helperChatId);

                    await this.sendUserProblem(ctx, message, problemId);

                    return ctx.reply(replyText.created(problemId));
                }
            } else {
                problemId = ProblemController.getId();

                await UserController.setPrevMessage(
                    userId,
                    `${ctx.userData.prevMessage}=${problemId}=${message}`
                );
            }

            return ctx.reply(
                replyText.sendAddMaterials,
                SupportSendAddMaterialKeyboard(problemId)
            );
        } catch (e) {
            console.log(e);
        }
    };

    checkUserMedia = async (ctx, userId, url) => {
        const replyText = replyMessages.tasks.giveTask.likes;
        const messageId = ctx.message.message_id;

        const { accountId } = ctx.userData;

        try {
            if (!validator.isUrl(url) || !url.includes("instagram"))
                throw "incorrect";

            const { author_id, thumbnail_url, title, media_id } =
                await InstagramService.getMainMediaData(url);

            if (author_id != accountId) throw "not_your_account";

            await UserController.setPrevMessage(
                userId,
                `create_likes_task=${url.slice(28, 39)}&${
                    media_id.split("_")[0]
                }`
            );
            // await ctx.replyWithPhoto(thumbnail_url, { caption: title });
            return ctx.reply(replyText.waitLikesCount);
        } catch (e) {
            let message = replyMessages.tasks.giveTask.errors;

            switch (e) {
                case "incorrect":
                    message = replyText.notVerifiedUrl;
                    break;

                case "not_found":
                    message = replyText.notFound;
                    break;

                case "not_your_account":
                    message = replyText.notYourAccount;
                    break;

                case "bad_request":
                    message = replyText.badRequest;
                    break;

                default:
                    console.log(e);
                    message = message.unhandledError;
                    break;
            }

            return ctx.reply(message, {
                reply_to_message_id: messageId,
            });
        }
    };

    messageListener = async (ctx) => {
        const {
            message,
            from: { id: userId },
        } = ctx;

        const { text } = message;

        const userData = ctx.userData;

        const { prevMessage, accountId, points } = userData;

        const { menu } = keyboardsMessages;

        const reservedMessages = {
            ...menu,
        };

        for (const command in reservedMessages) {
            if (text === reservedMessages[command]) {
                if (!accountId) {
                    await UserController.setPrevMessage(userId, "reg");
                    return ctx.reply(
                        replyMessages.newInstAccount
                            .firstCompleteTheRegistration
                    );
                }

                if (prevMessage) {
                    await UserController.clearPrevMessage(userId);
                }
                return this[command](ctx, userId, userData);
            }
        }

        if (prevMessage === "reg")
            return this.regNewInstAccount(ctx, userId, text);
        if (prevMessage === "create_followers_task")
            return this.callculateCost(
                ctx,
                text,
                PointsRate.followers,
                points,
                "followers",
                accountId
            );

        if (prevMessage === "create_likes_task=get_user_media")
            return this.checkUserMedia(ctx, userId, text);

        if (prevMessage?.includes("support_describe_a_problem"))
            return this.createUserProblem(ctx, text);

        if (prevMessage?.includes("create_likes_task"))
            return this.callculateCost(
                ctx,
                text,
                PointsRate.likes,
                points,
                "likes",
                prevMessage.split("=")[1]
            );

        return ctx.reply(replyMessages.iDontUnderstand);
    };

    // wait = (seconds) =>
    //     new Promise((resolve) => setTimeout(() => resolve(), seconds * 1000));

    sendFollowersTaskInfo = async (ctx, userId) => {
        const replyText = replyMessages.tasks.giveTask.followers;
        // const messageId = ctx.callbackQuery.message.message_id;

        await ctx.editMessageText(replyText.about);
        // await this.wait(3);
        await ctx.reply(replyText.showCurrentBalance(1000));
        // await this.wait(2);
        await ctx.reply(replyText.pointsRate);
        await UserController.setPrevMessage(userId, "create_followers_task");
        // await this.wait(3);
        return ctx.reply(replyText.waitFollowersCount);
    };

    callculateCost = async (ctx, count, [a, b], userPoints, taskType, data) => {
        let replyText = replyMessages.tasks.giveTask;
        const messageId = ctx.message.message_id;

        if (isNaN(count)) {
            return ctx.reply(replyText.errors.notANumber, {
                reply_to_message_id: messageId,
            });
        }

        if (count < TasksConfig.minCount[taskType]) {
            return ctx.reply(replyText.errors.lessThenMinCount[taskType], {
                reply_to_message_id: messageId,
            });
        }

        const cost = (count * a) / b;

        if (cost > userPoints) {
            return ctx.reply(replyText.errors.notEnoughPoints, {
                reply_to_message_id: messageId,
            });
        }

        replyText = replyText[taskType];

        await UserController.clearPrevMessage(ctx.from.id);
        await ctx.reply(replyText.showCost(cost), {
            reply_to_message_id: messageId,
        });

        const callback_data = [count, data];

        return ctx.reply(
            replyText.waitUserAgree,
            DoYouAgreeKeyboard(taskType, callback_data)
        );
    };

    sendNotificationsAboutNewTask = async (ctx, chatId, count) => {
        const users = await UserController.getUsersWithEnabledNotifications(
            count,
            chatId
        );

        //TODO: remove this where the app will go out development
        {
            console.log(
                `Notifications.\nCreator: <${ctx.from.first_name}:${ctx.userData.accountUsername}>`
            );
            console.table(users);
        }

        users.forEach(({ chatId }) => {
            try {
                const replyText = replyMessages.tasks.notifications;
                ctx.tg.sendMessage(chatId, replyText);
            } catch (e) {
                console.log(e);
            }
        });
    };

    createTask = async (ctx, userId, [count, data], taskType, [a, b]) => {
        const replyText = replyMessages.tasks.giveTask;

        const cost = (count * a) / b;

        try {
            const message = replyText[taskType];

            console.log(data);

            await TaskController.createTask(
                userId,
                taskType,
                data,
                count,
                cost
            );

            await ctx.editMessageText(message.successfulAddTask, {});

            return this.sendNotificationsAboutNewTask(ctx, ctx.chat.id, count);
        } catch (e) {
            let message = "";

            switch (e) {
                case "not_enought_points":
                    message = replyText.errors.notEnoughPoints;
                    break;

                default:
                    console.log(e);
                    message = replyText.errors.errorWhileCreatingTask;
                    break;
            }

            ctx.editMessageText(message, {});
        }
    };

    sendLikesTaskInfo = async (ctx, userId) => {
        const replyText = replyMessages.tasks.giveTask.likes;

        await UserController.setPrevMessage(
            userId,
            "create_likes_task=get_user_media"
        );
        return ctx.editMessageText(replyText.about);
    };

    cancel = async (ctx) => ctx.editMessageText(replyMessages.cancelQuery, {});

    checkTheFTaskIsOver = async (ctx, taskAccountId) =>
        (await InstagramService.getUserFollowers(ctx, taskAccountId)).some(
            ({ pk }) => pk == ctx.userData.accountId
        );

    checkTheLTaskIsOver = async (ctx, mediaId) =>
        (await InstagramService.getMediaLikes(ctx, mediaId)).users.some(
            ({ pk }) => pk == ctx.userData.accountId
        );

    sendReferralRewards = async (ctx) => {
        const {
            message: {
                chat: { id: chatId },
            },
            from: { first_name: firstName, id: userId },
        } = ctx.callbackQuery;

        const { referralParent } = ctx.userData;

        const replyText = replyMessages.referralRewards;

        try {
            const parent = await UserController.getReferralData(referralParent);
            const child = await UserController.getReferralData(userId);

            child.points += ReferralRewards.points;
            child.gotReferralReward = true;
            parent.points += ReferralRewards.points;

            const { firstName: refirstName, chatId: rechatId } = parent;

            await ctx.tg.sendMessage(rechatId, replyText.parent(firstName));
            await parent.save();

            await ctx.tg.sendMessage(chatId, replyText.child(refirstName));
            return await child.save();
        } catch (e) {
            console.log(e);
        }
    };

    checkTheTaskIsOver = async (ctx, userId, [data, taskId, taskType]) => {
        const {
            message: { reply_markup: cacheReplyMarkup },
        } = ctx.callbackQuery;

        let cacheReply = ctx.callbackQuery.message;

        let replyText = replyMessages.tasks.getAvaliableTasks;
        let isOver = false;

        const editMessage = (taskType) => {
            switch (taskType) {
                case "f":
                    replyText = replyText.followers;
                    cacheReply = cacheReply.caption;
                    return (caption) => ctx.editMessageCaption(caption);

                case "l":
                    replyText = replyText.likes;
                    cacheReply = cacheReply.text;
                    return (text) => ctx.editMessageText(text);
            }
        };

        const messageEditor = editMessage(taskType);

        try {
            await messageEditor(replyText.check);

            switch (taskType) {
                case "f":
                    isOver = await this.checkTheFTaskIsOver(ctx, data);
                    break;

                case "l":
                    isOver = await this.checkTheLTaskIsOver(ctx, data);
                    break;
            }
            if (!isOver) throw "task_isnot_completed";

            await TaskController.markCompleted(userId, taskId);

            await messageEditor(replyText.successfullyExecuted);

            const { referralParent, gotReferralReward } = ctx.userData;
            if (referralParent && !gotReferralReward) {
                await messageEditor(replyText.successfullyExecutedWithReward);

                return this.sendReferralRewards(ctx);
            }

            return this.getAvaliableTasks(ctx, userId, ctx.userData);
        } catch (e) {
            let message = "";

            switch (e) {
                case "task_isnot_completed":
                    message = replyText.notCompleted;
                    // console.log(message);
                    break;

                case "Incorrect task type":
                    message = replyText.unhandledError;
                    break;

                case "service_is_unavaliabe":
                    message = replyText.instagramServiceIsUnavaliable;
                    break;

                case "many_requests":
                    message = replyText.manyRequests;
                    break;

                default:
                    console.log(e);
                    message = replyText.unhandledError;
                    break;
            }

            await messageEditor(message);

            setTimeout(async () => {
                try {
                    await messageEditor(cacheReply);
                    await ctx.editMessageReplyMarkup(cacheReplyMarkup);
                } catch (e) {
                    console.log(e);
                }
            }, WarningsConfig.warnDuration * 1000);
        }
    };

    becomeAReferral = async (ctx, userId) => {
        const replyText = replyMessages.referralRewards.becomeAReferral(userId);
        ctx.reply(replyText);
    };

    markProblemAsFixed = async (ctx, [problemId, chatId]) => {
        const cacheText = ctx.callbackQuery.message.text;
        const replyText = replyMessages.support;

        console.log(cacheText);

        try {
            await ctx.editMessageText(replyText.fixed(cacheText));
            await ctx.tg.sendMessage(
                chatId,
                replyText.theProblemIsSuccessfullyCompleted(problemId)
            );
        } catch (e) {
            console.log(e);
        }
    };

    supportSkipStep = async (ctx, userId, [problemId]) => {
        const replyText = replyMessages.support;
        // const messageId = ctx.callbackQuery.message.message_id;

        try {
            await UserController.clearPrevMessage(userId);
            await this.sendUserProblem(
                ctx,
                ctx.userData.prevMessage.split("=")[2],
                problemId
            );
            return ctx.editMessageText(replyText.created(problemId));
            // return ctx.reply(replyText.created(problemId));
        } catch (e) {
            console.log(e);
        }
    };

    callbackQueryListener = async (ctx) => {
        const {
            callbackQuery: { data },
            from: { id: userId },
        } = ctx;

        const {
            giveTask,
            // doYouAgree,
            // getPoints
        } = keyboardsMessages;

        const userData = ctx.userData;

        if (data === giveTask.likes.callback_data)
            return this.sendLikesTaskInfo(ctx, userId);
        if (data === giveTask.followers.callback_data)
            return this.sendFollowersTaskInfo(ctx, userId);
        if (data === "cancel") return this.cancel(ctx, userId);
        if (data === "give_me_a_task")
            return this.getAvaliableTasks(ctx, userId, userData);
        if (data === "become_a_referral")
            return this.becomeAReferral(ctx, userId);

        let [command, _data] = data.split("=");

        _data = JSON.parse(_data);

        if (command === "cft")
            return this.createTask(
                ctx,
                userId,
                _data,
                "followers",
                PointsRate.followers
            );

        if (command === "clt_m")
            return this.createTask(
                ctx,
                userId,
                _data,
                "likes",
                PointsRate.likes
            );

        if (command === "cttio")
            return this.checkTheTaskIsOver(ctx, userId, _data);
        if (command === "stpisc") return this.markProblemAsFixed(ctx, _data);
        if (command === "support_ss")
            return this.supportSkipStep(ctx, userId, _data);
    };
}

module.exports = new MessageController();

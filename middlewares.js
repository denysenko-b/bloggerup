const Texts = require("./texts");
const UserController = require("./controllers/user.controller");
const WarningsConfig = require("./config/warnings.config");
const CommandController = require("./controllers/command.controller");
const HelperConfig = require("./config/helper.config");

class Middlewares {
    checkUser = async (ctx, next) => {

        const {
            from: { id: userId, first_name, username },
            chat: { id: chatId },
        } = ctx;

        const newActivity = Date.now();

        try {
            ctx.userData = await UserController.getUserData(
                userId,
                first_name,
                username,
                ctx.update.message ? newActivity : 0
            );

            if (ctx.userData) {
                const { banned, lastActivity, lastActivityInst } = ctx.userData;
                const deltaTime = (newActivity - lastActivity) / 1000;
                ctx.deltaInstTime = (newActivity - lastActivityInst) / 1000;

                const replyText = Texts.reply.messages.ban;

                if (deltaTime < WarningsConfig.minTimeDelay) {
                    const { message_id } = await ctx.reply(
                        replyText.spam
                    );

                    return setTimeout(() => {
                        try {
                            ctx.tg.deleteMessage(chatId, message_id);
                        } catch (e) {
                            console.log(e);
                        }
                    }, WarningsConfig.warnDuration * 1000);
                }

                if (banned) {
                    return ctx.reply(replyText.finnaly);
                }
            }

            return next();
        } catch (e) {
            console.log(e);
            return ctx.reply(Texts.reply.messages.error());
        }
    };

    isNewUser = async (ctx, next) => {
        if (!ctx.userData) {
            return await CommandController.start(ctx);
        }

        return next();
    };

    support = async (ctx, next) => {
        if (
            ctx?.from?.id === HelperConfig.id &&
            ctx?.message?.reply_to_message
        ) {
            const {
                message: {
                    reply_to_message: { text },
                    text: replyText,
                },
            } = ctx;

            const rows = text.split("\n");

            if (rows[0] !== "#BUG") return next();

            try {
                const clientData = [];
                let start = rows.findIndex((row) => row.slice(0, 2) === "Id");
                clientData.push(rows[start].slice(3));

                start = rows.findIndex((row) => row === "From:") + 1;

                rows.slice(start, start + 4).forEach((item) => {
                    const [, value] = item.split(" - ");
                    clientData.push(value);
                });

                await ctx.tg.sendMessage(
                    clientData[3],
                    Texts.reply.messages.support.sendMessage(clientData[1], replyText)
                );
            } catch (e) {
                console.log(e);
                await ctx.reply(Texts.reply.messages.error());
            }
            return;
        }

        return next();
    };
}

module.exports = new Middlewares();

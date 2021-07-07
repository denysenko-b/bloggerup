const UserController = require("./user.controller");
// const Keyboards = require('../keyboards');
const Texts = require("../texts");

const { MenuKeyboard } = require("../keyboards");

class CommandsController {
    constructor() {
        this.replyTexts = Texts.reply.commands;
    }

    commands = Texts.commands;

    start = (ctx) =>
        UserController.create(
            ctx.from.id,
            ctx.from.first_name,
            ctx.chat.id,
            ctx.from.username,
            "reg",
            ctx.startPayload
        )
            .then(() => ctx.reply(this.replyTexts.start))
            .catch((e) => {
                console.log(e);
            });

    help = async (ctx) => {
        if (ctx.userData.prevMessage) 
            await UserController.clearPrevMessage(ctx.from.id)
        
        return await ctx.reply(this.replyTexts.help);
    }

    menu = async (ctx) => {
        if (ctx.userData.prevMessage) 
            await UserController.clearPrevMessage(ctx.from.id)

        return await ctx.reply(this.replyTexts.menu, MenuKeyboard);
    }

    notifications = async (ctx) => {
        const userId = ctx.from.id;
        const text = this.replyTexts.notifications;

        await UserController.clearPrevMessage(userId);
        const notifications = await UserController.switchNotifications(userId);

        if (notifications) {
            await ctx.reply(text.on);
        } else {
            await ctx.reply(text.off);
        }
    };

    support = async (ctx) => {
        try {
            await UserController.setPrevMessage(ctx.from.id, "support_describe_a_problem");
            return await ctx.reply(this.replyTexts.support);
        } catch (e) {
            console.log(e);
        }
    }

    cancel = async (ctx) => {
        try {
            await UserController.clearPrevMessage(ctx.from.id);
            return await ctx.reply(this.replyTexts.cancel);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new CommandsController();

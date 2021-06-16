const UserController = require('./user.controller');
// const Keyboards = require('../keyboards');
const Texts = require('../texts');

const {MenuKeyboard} = require('../keyboards');

class CommandsController {

    constructor() {
        this.replyTexts = Texts.reply.commands;
    }

    commands = Texts.commands;

    start = ctx => UserController.create(ctx.from.id, 'reg')
        .then(() => {
            ctx.reply(this.replyTexts.start)
        })
        .catch(() => {
            ctx.reply(this.replyTexts.error('start'));
        })

    help = ctx => {
        ctx.reply(this.replyTexts.help);
    }

    menu = ctx => {
        ctx.reply(this.replyTexts.menu, MenuKeyboard);
    }

    notifications = async ctx => {
        const userId = ctx.from.id;
        const text = this.replyTexts.notifications;

        const notifications = await UserController.switchNotifications(userId);

        if (notifications) {
            ctx.reply(text.on);
        } else {
            ctx.reply(text.off);
        }
    }

    cancel = async ctx =>
        UserController.clearPrevMessage(ctx.from.id)
        .then(() => ctx.reply(this.replyTexts.cancel))
        .catch(() => ctx.reply(this.replyTexts.error('cancel')))
}

module.exports = new CommandsController();
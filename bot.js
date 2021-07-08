const { Telegraf } = require("telegraf");
const { token } = require("./config/bot.config");

const CommandController = require("./controllers/command.controller");
const MessageController = require("./controllers/message.controller");
const PaymentController = require("./controllers/payment.controller");
const Middlewares = require("./middlewares");

const bot = new Telegraf(token);

bot.telegram.setMyCommands(CommandController.commands);

// bot.hears('dev', ctx => {
//     ctx.editMessageText()
// })
//payment
bot.on("pre_checkout_query", (ctx) =>
    setImmediate(() => PaymentController.check(ctx).catch(console.log))
);
bot.on("successful_payment", (ctx) =>
    setImmediate(() => PaymentController.successful(ctx).catch(console.log))
);

//middleware
bot.use((ctx, next) =>
    setImmediate(() => Middlewares.checkUser(ctx, next).catch(console.log))
);

//comamnds
bot.start((ctx) =>
    setImmediate(() => CommandController.start(ctx).catch(console.log))
);
bot.help((ctx) =>
    setImmediate(() => CommandController.help(ctx).catch(console.log))
);
bot.command("menu", (ctx) =>
    setImmediate(() => CommandController.menu(ctx).catch(console.log))
);
bot.command("notifications", (ctx) =>
    setImmediate(() => CommandController.notifications(ctx).catch(console.log))
);
bot.command("support", (ctx) =>
    setImmediate(() => CommandController.support(ctx).catch(console.log))
);
// bot.command('cancel', CommandsController.cancel)

bot.use((ctx, next) =>
    setImmediate(() => Middlewares.isNewUser(ctx, next).catch(console.log))
);

bot.use((ctx, next) =>
    setImmediate(() => Middlewares.support(ctx, next).catch(console.log))
);
bot.on("message", (ctx) =>
    setImmediate(() =>
        MessageController.messageListener(ctx).catch(console.log)
    )
);

bot.on("callback_query", (ctx) =>
    setImmediate(() =>
        MessageController.callbackQueryListener(ctx).catch(console.log)
    )
);

const start = () =>
    bot
        .launch()
        .then(() => {
            console.log(`Successful start bot`);
        })
        .catch((e) => {
            console.error(e);
        });

module.exports = {
    start,
    stop: bot.stop,
};

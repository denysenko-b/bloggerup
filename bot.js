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
    PaymentController.check(ctx).catch(console.log)
);
bot.on("successful_payment", (ctx) =>
    PaymentController.successful(ctx).catch(console.log)
);

//middleware
bot.use((ctx, next) => Middlewares.checkUser(ctx, next).catch(console.log));

//comamnds
bot.start((ctx) => CommandController.start(ctx).catch(console.log));
bot.help((ctx) => CommandController.help(ctx).catch(console.log));
bot.command("menu", (ctx) => CommandController.menu(ctx).catch(console.log));
bot.command("notifications", (ctx) =>
    CommandController.notifications(ctx).catch(console.log)
);
bot.command("support", (ctx) => CommandController.support(ctx).catch(console.log));
// bot.command('cancel', CommandsController.cancel)

bot.use((ctx, next) => Middlewares.isNewUser(ctx, next).catch(console.log));

bot.use((ctx, next) => Middlewares.support(ctx, next).catch(console.log));
bot.on("message", (ctx) =>
    MessageController.messageListener(ctx).catch(console.log)
);

bot.on("callback_query", (ctx) =>
    MessageController.callbackQueryListener(ctx).catch(console.log)
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

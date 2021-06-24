const { Telegraf } = require("telegraf");
const { token } = require("./config/bot.config");

const CommandController = require("./controllers/command.controller");
const MessageController = require("./controllers/message.controller");
const PaymentController = require('./controllers/payment.controller');
const Middlewares = require("./middlewares");

const bot = new Telegraf(token);

bot.telegram.setMyCommands(CommandController.commands);

//payment
bot.on("pre_checkout_query", PaymentController.check);
bot.on("successful_payment", PaymentController.successful);

//middleware
bot.use(Middlewares.checkUser);

//comamnds
bot.start(CommandController.start);
bot.help(CommandController.help);
bot.command("menu", CommandController.menu);
bot.command("notifications", CommandController.notifications);
bot.command("support", CommandController.support);
// bot.command('cancel', CommandsController.cancel)

bot.use(Middlewares.isNewUser);

bot.use(Middlewares.support);
bot.on("message", MessageController.messageListener);


bot.on("callback_query", MessageController.callbackQueryListener);

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

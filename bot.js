const {
    Telegraf
} = require('telegraf')
const {
    token
} = require('./config/bot.config');

const CommandsController = require('./controllers/command.controller');
const MessageController = require('./controllers/message.controller');

const bot = new Telegraf(token);


bot.telegram.setMyCommands(CommandsController.commands);

//comamnds
bot.start(CommandsController.start);
bot.help(CommandsController.help)
bot.command('menu', CommandsController.menu)
bot.command('notifications', CommandsController.notifications)
bot.command('cancel', CommandsController.cancel)

bot.on('message', MessageController.messageListener);
bot.on('callback_query', MessageController.callbackQueryListener);


const start = () => bot.launch()
    .then(() => {
        console.log(`Successful start bot`)
    })
    .catch((e) => {
        console.error(e);
    });


module.exports = {
    start,
    stop: bot.stop
}
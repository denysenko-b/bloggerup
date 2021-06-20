const {
    Telegraf
} = require('telegraf')
const {
    token
} = require('./config/bot.config');

const CommandsController = require('./controllers/command.controller');
const MessageController = require('./controllers/message.controller');
const Middlewares = require('./middlewares');

const bot = new Telegraf(token);


bot.telegram.setMyCommands(CommandsController.commands);

// //dev
bot.hears('dev', ctx => {
    // ctx.deleteMessage()
})
//

//middleware
bot.use(Middlewares.checkUser);

//comamnds
bot.start(CommandsController.start);
bot.help(CommandsController.help)
// bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.command('menu', CommandsController.menu)
bot.command('notifications', CommandsController.notifications)
// bot.command('cancel', CommandsController.cancel)

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
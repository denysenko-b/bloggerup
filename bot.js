const {
    Telegraf
} = require('telegraf')
const {
    token
} = require('./config/bot.config');

const CommandController = require('./controllers/command.controller');
const MessageController = require('./controllers/message.controller');
const Middlewares = require('./middlewares');

const bot = new Telegraf(token);


bot.telegram.setMyCommands(CommandController.commands);

// //dev
bot.hears('dev', ctx => {
    // ctx.deleteMessage()
    // ctx.editMessageCaption()
})
//

//middleware
bot.use(Middlewares.checkUser);

//comamnds
bot.start(CommandController.start);
bot.help(CommandController.help)
// bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.command('menu', CommandController.menu)
bot.command('notifications', CommandController.notifications)
// bot.command('cancel', CommandsController.cancel)

bot.use(Middlewares.isNewUser)

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
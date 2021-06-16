const {
    Telegraf
} = require('telegraf')
const {
    token
} = require('../config/bot.config');

//localization
const locales = require('./locales');

const keyboards = require('./keyboards');

//middleware
const getOptimalLanguage = require('./middlewares/getOptimalLanguage');

const bot = new Telegraf(token);

//поставив оптимальну для юзера мову. додає новий параметр до контексту. не змінює старих.
bot.use(getOptimalLanguage);

bot.telegram.setMyCommands([
    {
        command: 'start', //DONT CHANGE
        description: 'Повторная регистрация'
    },
    {
        command: 'menu', //DONT CHANGE
        description: 'Показать кнопки меню'
    },
    {
        command: 'help', //DONT CHANGE
        description: 'Справка'
    },
    {
        command: 'notifications', //DONT CHANGE
        description: 'Включить/ выключить оповещения о новых заданиях'
    }
]);

bot.start((ctx) => ctx.reply('Welcome')) //TODO: in future updates

bot.help((ctx) => {
    const lang = ctx.from.lang;
    const text = locales[lang].reply.commands.help;

    ctx.reply(text);
})
bot.command('menu', ctx => {
    const lang = ctx.from.lang;
    const text = locales[lang].reply.commands.menu;

    ctx.reply(text, keyboards.menu(lang));
})


//dev comamnds
bot.on('sticker', (ctx) => {
    console.log(ctx.from);
    ctx.reply('👍');
})
bot.hears('hi', (ctx) => ctx.reply('Hey there'))


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
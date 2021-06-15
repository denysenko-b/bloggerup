const {
    Telegraf
} = require('telegraf')
const {
    token
} = require('../config/bot.config');

const bot = new Telegraf(token);
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
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
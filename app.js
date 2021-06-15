const bot = require('./bot');

const db = require('./db');

function start() {
    db.connect();
    bot.start();
}

start();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
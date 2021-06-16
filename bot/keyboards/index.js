const {
    Keyboard
} = require('telegram-keyboard');

const locales = require('../locales');

const menu = (lang) => Keyboard.reply(
    Object.keys(locales[lang].keyboards.menu)
    .map(key => locales[lang].keyboards.menu[key])
);

class Keyboards {
    constructor() {

    }

    menu = (lang) => this[lang].menu;
}

module.exports = {
    menu
}
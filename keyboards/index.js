const {
    keyboards: {
        menu,
        giveTask
    }
} = require('../texts');

const createKeyboard = (type, keyboard, options={}) => ({
    "reply_markup": {
        ...options,
        [type]: keyboard
    }
})

const MenuKeyboard = createKeyboard(
    'keyboard',
    Object.keys(menu).map(key => [menu[key]]),
    {
        resize_keyboard: true
    }
);

const SelectTaskTypeInlineKeyboard = createKeyboard(
    'inline_keyboard',
    [
        ...Object.keys(giveTask).map(key => [giveTask[key]])
    ]
)

module.exports = {
    MenuKeyboard,
    SelectTaskTypeInlineKeyboard
}
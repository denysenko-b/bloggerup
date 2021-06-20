const {
    keyboards: {
        menu,
        giveTask,
        doYouAgree,
        getPoints,
        checkTheTaskIsOver
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

const DoYouAgreeKeyboard = (type, callback_data) => createKeyboard('inline_keyboard', doYouAgree[type](JSON.stringify(callback_data)));

const GetPointsKeyboard = createKeyboard('inline_keyboard', getPoints);

const CheckTheTaskIsOverKeyboard = (type, callback_data) => createKeyboard('inline_keyboard', checkTheTaskIsOver[type](JSON.stringify(callback_data)))

module.exports = {
    MenuKeyboard,
    SelectTaskTypeInlineKeyboard,
    DoYouAgreeKeyboard,
    GetPointsKeyboard,
    CheckTheTaskIsOverKeyboard
}
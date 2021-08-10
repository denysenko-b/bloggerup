const {
    keyboards: {
        menu,
        giveTask,
        doYouAgree,
        getPoints,
        checkTheTaskIsOver,
        supportSendAddMaterial,
        supportTheProblemIsSuccessfulyCompleted,
        referralLink,
        selectThePaymentProvider,
        manageTasks,
        myTasks,
        policies
    },
} = require("./texts");

const { taskPerPage } = require("./config/tasks.config");

const createKeyboard = (type, keyboard, options = {}) => ({
    reply_markup: {
        ...options,
        [type]: keyboard,
    },
});

const MenuKeyboard = createKeyboard(
    "keyboard",
    Object.keys(menu).map((key) => [menu[key]]),
    {
        resize_keyboard: true,
    }
);

const SelectTaskTypeInlineKeyboard = createKeyboard("inline_keyboard", [
    ...Object.keys(giveTask).map((key) => [giveTask[key]]),
]);

const DoYouAgreeKeyboard = (type, callback_data) =>
    createKeyboard(
        "inline_keyboard",
        doYouAgree[type](JSON.stringify(callback_data))
    );

const GetPointsKeyboard = createKeyboard("inline_keyboard", getPoints);

const CheckTheTaskIsOverKeyboard = (callback_data, shortUrl) =>
    createKeyboard(
        "inline_keyboard",
        checkTheTaskIsOver(JSON.stringify(callback_data), shortUrl)
    );

const SupportSendAddMaterialKeyboard = (id) =>
    createKeyboard("inline_keyboard", supportSendAddMaterial(id));

const SupportTheProblemIsSuccessfulyCompleted = (problemId, chatId) =>
    createKeyboard(
        "inline_keyboard",
        supportTheProblemIsSuccessfulyCompleted(
            JSON.stringify([problemId, chatId])
        )
    );

const ReferralLinkKeyboard = (userId) =>
    createKeyboard("inline_keyboard", referralLink(userId));

const SelectThePaymentProviderKeyboard = (points) =>
    createKeyboard("inline_keyboard", selectThePaymentProvider(points));

const ManageTasksKeyboard = createKeyboard("inline_keyboard", manageTasks);

const CreateMyTasksListKeyboard = (tasks, next = 0, done = true) => {
    const keyboard = tasks.map((task, id) => {
        const correctId = id + taskPerPage * next + 1;
        return [
            {
                text: myTasks.item.createText(task, correctId),
                callback_data: myTasks.item.createCallbackData(
                    task._id,
                    next,
                    correctId
                ),
            },
        ];
    });

    const nextprevButtons = [];

    if (!done) nextprevButtons.push(myTasks.nextButton(next));
    if (next > 0) nextprevButtons.unshift(myTasks.prevButton(next));

    if (nextprevButtons[0]) keyboard.push(nextprevButtons);

    return createKeyboard("inline_keyboard", keyboard);
};

const TaskEditorKeyboard = (taskId, taskState, next, id) => {
    const keyboard = [];

    if (taskState === "active") {
        keyboard.push([myTasks.freezeButton(taskId, next, id)]);
    } else if (taskState === "freezed") {
        keyboard.push([myTasks.unfreezeButton(taskId, next, id)]);
    }
    keyboard.push([myTasks.backButton(next)]);

    return createKeyboard("inline_keyboard", keyboard);
};

const PoliciesKeyboard = createKeyboard("inline_keyboard", policies)

module.exports = {
    MenuKeyboard,
    ManageTasksKeyboard,
    CreateMyTasksListKeyboard,
    TaskEditorKeyboard,

    SelectTaskTypeInlineKeyboard,
    DoYouAgreeKeyboard,
    GetPointsKeyboard,
    CheckTheTaskIsOverKeyboard,
    ReferralLinkKeyboard,

    SupportSendAddMaterialKeyboard,
    SupportTheProblemIsSuccessfulyCompleted,
    SelectThePaymentProviderKeyboard,

    PoliciesKeyboard
};

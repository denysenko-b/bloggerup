const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CompletedSchema = new Schema(
    {
        data: String,
        taskType: String,
        completedAt: {
            type: Date,
            default: new Date(Date.now()),
        },
    },
    {
        _id: false,
    }
);

const UserSchema = new Schema({
    userId: {
        type: Number,
        require: true,
    },

    chatId: {
        type: Number,
        require: true,
    },

    firstName: String,
    tgUsername: String,

    accountUsername: {
        type: String,
        default: ''
    },
    accountId: {
        type: String,
        default: ''
    },

    points: {
        type: Number,
        default: 500000,
    },

    referralParent: Number,
    gotReferralReward: {
        type: Boolean,
        default: false,
    },

    prevMessage: String,

    notifications: {
        type: Boolean,
        default: true,
    },

    completed: [CompletedSchema],

    banned: {
        type: Boolean,
        default: false,
    },

    lastActivity: {
        type: Date,
        default: new Date(Date.now()),
    },
    lastActivityInst: {
        type: Date,
        default: new Date(Date.now()),
    },
    addedAt: {
        type: Date,
        default: new Date(Date.now()),
    },

    lastTaskNotificationDate: {
        type: Date,
        default: new Date(1),
    },
});

module.exports = mongoose.model("User", UserSchema);

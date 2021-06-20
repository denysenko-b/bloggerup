const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CompletedSchema = new Schema({
    data: String,
    taskType: String
}, {
    _id: false
})

const UserSchema = new Schema({
    userId: {
        type: Number,
        unique: true,
        require: true
    },

    chatId: {
        type: Number,
        unique: true,
        require: true
    },

    firstName: String,
    tgUsername: String,

    accountUsername: {
        type: String,
        unique: true
    },
    accountId: {
        type: String,
        unique: true
    },

    points: {
        type: Number,
        default: 500000
    },

    referralParent: Number,
    gotReferralReward: {
        type: Number,
        defaul: false
    },

    prevMessage: String,

    notifications: {
        type: Boolean,
        default: true
    },

    completed: [
        CompletedSchema
    ],

    banned: {
        type: Boolean,
        default: false
    }
})


module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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
    accountId: String,

    points: {
        type: Number,
        default: 500000
    },

    referralsCount: {
        type: Number,
        default: 0
    },

    referralParent: {
        type: Number
    },

    prevMessage: String,

    notifications: {
        type: Boolean,
        default: true
    }
})


module.exports = mongoose.model('User', UserSchema);
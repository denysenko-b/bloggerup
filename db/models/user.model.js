const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    userId: {
        type: Number,
        unique: true,
        require: true
    },

    accountUsername: String,
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
        type: Number,
        unique: true,
        require: false
    },

    prevMessage: String
})


module.exports = mongoose.model('User', UserSchema);
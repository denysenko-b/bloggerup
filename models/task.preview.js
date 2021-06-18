const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    authorId: {
        type: Number,
        require: true,
        unique: true
    },
    taskType: {
        type: String,
        require: true
    },
    data: {
        type: String,
        require: true
    },
    count: {
        type: Number,
        require: true
    },
    points: {
        type: Number,
        require: true
    }
})

module.exports = mongoose.model('Task Preview', TaskSchema);
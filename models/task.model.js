const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    authorId: {
        type: Number,
        require: true
    },

    /**
     * Тип завдання
     * Лайки під постом
     * 
     * Підписки
     */
    taskType: {
        type: String,
        require: true
    },
    data: {
        type: String,
        require: true
    },
    completed: {
        type: Number,
        default: 0
    },
    count: {
        type: Number,
        require: true
    },

    done: {
        type: Boolean,
        default: false
    },

    publishedAt: {
        type: Date,
        default: new Date(Date.now())
    }
})

module.exports = mongoose.model('Task', TaskSchema);
const Task = require('../models/task.model');
const User = require('../models/user.model');
// const TaskPreview = require('../models/task.preview');
const {
    payForTask,
    getCompleted
} = require('./user.controller');

class TaskController {

    // createTaskPreview = async (authorId, taskType, data, count, points) => {
    //     try {
    //         const task = await TaskPreview.findOne({
    //             authorId
    //         });

    //         if (task) {
    //             task.taskType = taskType;
    //             task.data = data;
    //             task.count = count;
    //             task.points = points;

    //             await task.save();

    //             return false;
    //         }
    //         await TaskPreview.create({
    //             authorId,
    //             taskType,
    //             data,
    //             count,
    //             points
    //         });
    //         return true;
    //     } catch (e) {
    //         console.log(e);
    //         throw 'e';
    //     }
    // }

    createTask = async (authorId, taskType, data, count, points) => {
        await payForTask(authorId, points);

        await Task.create({
            authorId,
            taskType,
            data,
            count
        })

        return;
    }

    markCompleted = async (userId, taskId) => {
        const task = await Task.findById(taskId).select('taskType data completed done');
        const {
            taskType,
            data
        } = task;

        await User.findOneAndUpdate({
            userId
        }, {
            $push: {
                completed: {
                    taskType,
                    data
                }
            }
        });

        task.completed++;
        if (task.completed == task.count) task.done = true;

        await task.save();
    }

    // checkCompleteFollowersTask = async (taskId, accountId) => {
    //     const task = await TaskPreview.findById(taskId);
    //     console.log(task);
    // }

    // removeTaskPreview = authorId => TaskPreview.findOneAndRemove({
    //     authorId
    // });

    getAvaliableTasks = async (userId, accountId) => {
        const userCompleted = (await getCompleted(userId)).map(task => task.data);
        userCompleted.push(accountId);
        console.log(userCompleted);
        // const {taskType, data} = await Task.findOne({completed: false, data: {$nin: userCompleted}}).select('data taskType');

        const task = await Task
            .find({
                completed: false,
                data: {
                    $nin: userCompleted
                }
            })
            // .aggregate()
        console.log(task);
    }
}

// const test = new TaskController();
// test.markCompleted(481225277, '60cc8713bde85f2608d9840f');

module.exports = new TaskController();
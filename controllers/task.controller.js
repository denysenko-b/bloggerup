const Task = require("../models/task.model");
const User = require("../models/user.model");
const PointsRate = require("../config/pointsRate.config");
const TaskConfig = require("../config/tasks.config");

const { payForTask, getCompleted } = require("./user.controller");

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
            count,
        });

        return;
    };

    markCompleted = async (userId, taskId) => {
        const task = await Task.findById(taskId).select(
            "taskType data taskState completed count"
        );
        const { taskType, data } = task;

        const { completed } = await User.findOneAndUpdate(
            {
                userId,
            },
            {
                $push: {
                    completed: {
                        taskType,
                        data,
                    },
                },
                $inc: {
                    points: PointsRate[taskType][0],
                },
            }
        ).select("completed");

        task.completed++;
        if (task.completed >= task.count) task.taskState = "done";

        await task.save();

        return completed;
    };

    // checkCompleteFollowersTask = async (taskId, accountId) => {
    //     const task = await TaskPreview.findById(taskId);
    //     console.log(task);
    // }

    // removeTaskPreview = authorId => TaskPreview.findOneAndRemove({
    //     authorId
    // });

    getMyTasks = (authorId, next = 0) =>
        Task.find({ authorId })
            .select("completed taskType taskState count")
            .skip(next * TaskConfig.taskPerPage)
            .limit(TaskConfig.taskPerPage + 1);

    getMyActiveTaskCount = (authorId) =>
        Task.countDocuments({ authorId, taskState: "active" });

    getTaskById = (taskId) =>
        Task.findById(taskId).select("data taskType taskState count completed");

    changeTaskState = async (taskId, taskState) => {
        const task = await Task.findById(taskId, { taskState }).select(
            "data taskType taskState count completed"
        );

        if (task.taskState !== "done") task.taskState = taskState;
        await task.save();

        return task;
    };

    getAvaliableTasks = async (userId, accountData) => {
        const userCompleted = (await getCompleted(userId)).map(
            (task) => task.data
        );
        userCompleted.push(accountData);

        const [task] = await Task.aggregate([
            {
                $sample: {
                    size: 10,
                },
            },
            {
                $match: {
                    taskState: {
                        $eq: "active",
                    },
                    data: {
                        $nin: userCompleted,
                    },
                    authorId: {
                        $ne: userId,
                    },
                },
            },
            {
                $project: {
                    data: 1,
                    taskType: 1,
                },
            },
        ]);

        return task;
    };
}

// const test = new TaskController();
// test.markCompleted(481225277, '60cc8713bde85f2608d9840f');

module.exports = new TaskController();

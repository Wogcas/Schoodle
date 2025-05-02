
class TaskDataSource {
    async getPendingTasks(parentId) {
        throw new Error('Method getPendingTasks must be implemented.');
    }

    async getTaskDetails(taskId) {
        throw new Error('Method getTaskDetails must be implemented.');
    }

    async approveTask(taskId, parentId) {
        throw new Error('Method approveTask must be implemented.');
    }
}

module.exports = TaskDataSource;

const grpc = require('@grpc/grpc-js');
const TaskDataSource = require('./taskDataSource');

class ParentalApprovalManagementGrpcService {
    constructor(taskDataSource) {
        if (!(taskDataSource instanceof TaskDataSource)) {
            throw new Error('taskDataSource must be an instance of TaskDataSource.');
        }
        this.taskDataSource = taskDataSource;
    }

    async GetPendingTasksToApprove(call, callback) {
        try {
            const parentId = call.request.parent_id;
            const tasksFromApi = await this.taskDataSource.getPendingTasks(parentId);
            const response = {
                tasks: tasksFromApi.map(task => ({
                    id: task.id,
                    title: task.title,
                    student_name: task.studentName,
                })),
            };
            callback(null, response);
        } catch (error) {
            console.error('Error getting pending tasks:', error);
            callback({ code: grpc.status.INTERNAL, details: 'Failed to retrieve pending tasks.' });
        }
    }

    async GetSelectedTask(call, callback) {
        try {
            const taskId = call.request.id;
            const taskFromApi = await this.taskDataSource.getTaskDetails(taskId);
            if (taskFromApi) {
                const response = {
                    id: taskFromApi.id,
                    title: taskFromApi.title,
                    description: taskFromApi.description,
                    assigned_user_id: taskFromApi.assignedUserId,
                    due_date: taskFromApi.dueDate,
                    creation_date: taskFromApi.creationDate,
                };
                callback(null, response);
            } else {
                callback({ code: grpc.status.NOT_FOUND, details: `Task with ID ${taskId} not found.` });
            }
        } catch (error) {
            console.error('Error getting selected task:', error);
            callback({ code: grpc.status.INTERNAL, details: 'Failed to retrieve the selected task.' });
        }
    }

    async ApproveTask(call, callback) {
        try {
            const taskId = call.request.task_id;
            const parentId = call.request.parent_id;
            const approvalResult = await this.taskDataSource.approveTask(taskId, parentId);
            const response = {
                success: approvalResult.success,
                message: approvalResult.message,
            };
            callback(null, response);
        } catch (error) {
            console.error('Error approving task:', error);
            callback({ code: grpc.status.INTERNAL, details: 'Failed to approve the task.' });
        }
    }
}

module.exports = ParentalApprovalManagementGrpcService;

import axios from 'axios';
const TaskDataSource = require('./taskDataSource');

const MOODLE_API = '#';

class ExternalTaskDataSource extends TaskDataSource {
    async getPendingTasks(parentId) {
        try {
            const response = await axios.get(`${MOODLE_API}/parents/${parentId}/pending-tasks`);
            return response.data;
        } catch (error) {
            console.error('Error fetching pending tasks from API:', error);
            throw error;
        }
    }

    async getTaskDetails(taskId) {
        try {
            const response = await axios.get(`${MOODLE_API}/tasks/${taskId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching task details from API:', error);
            throw error;
        }
    }

    async approveTask(taskId, parentId) {
        try {
            const response = await axios.post(`${MOODLE_API}/tasks/${taskId}/approve`, { parentId });
            return response.data;
        } catch (error) {
            console.error('Error approving task on API:', error);
            throw error;
        }
    }
}

module.exports = ExternalTaskDataSource;
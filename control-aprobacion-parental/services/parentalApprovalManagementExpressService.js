
import axios from 'axios';
import TaskDataSource from './taskDataSource.js';

const MOODLE_API = 'http://localhost:8080/api/moodle/rest';

class ExternalTaskDataSource extends TaskDataSource {

    async getSiteInfo() {
        try {
            const response = await axios.get(`${MOODLE_API}/site-info`);
            console.log('Site info from API:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching site info from API:', error);
            throw error;
        }
    }

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

export default ExternalTaskDataSource;
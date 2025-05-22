import https from 'https';
import axios from 'axios';
import fs from 'fs';
import TaskDataSource from './taskDataSource.js';

const MOODLE_API = 'https://localhost:8080/api/moodle/rest';

class SecureExternalTaskDataSource extends TaskDataSource {
    constructor() {
        super();
        this.axiosInstance = axios.create({
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
                cert: fs.readFileSync('../key.pem'),
                key: fs.readFileSync('../cert.pem'),
            }),
            baseURL: 'https://localhost:8080/api/moodle/rest'
        });
    }

    async getSiteInfo() {
        try {
            const response = await this.axiosInstance.get('/site-info');
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

    async getTaskDetails(id, task) {
        try {
            const response = await taskDAO.updateTask(id, task);
            if (!response) {
                throw new Error(`Task with ID ${id} not found`);
            }
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

export default SecureExternalTaskDataSource;
import axios from 'axios';
import CONSTANTS from '../config/constants';
import { ApiResponse } from '../types/api';

export default class MoodleAPI {
    private instance: any;

    constructor() {
        this.instance = axios.create({
            baseURL: CONSTANTS.MOODLE_URL,
            timeout: 10000
        });
    }

    async getSiteInfo(): Promise<ApiResponse> {
        try {
            const response = await this.instance.get('/site-info');
            return {
                success: true,
                status: response.status,
                data: response.data
            };
        } catch (error: any) {
            return {
                success: false,
                status: error.response?.status || 503,
                error: error.message
            };
        }
    }
}
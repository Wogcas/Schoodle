import axios from 'axios';
import CONSTANTS from '../config/constants';
import { ApiResponse } from '../types/api';

export default class SchoolSystemAPI {
    private instance: any;

    constructor() {
        this.instance = axios.create({
            baseURL: CONSTANTS.SCHOOL_SYSTEM_URL,
            timeout: 8000
        });
    }

    async getSystemInfo(): Promise<ApiResponse> {
        try {
            const response = await this.instance.get('/info');
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
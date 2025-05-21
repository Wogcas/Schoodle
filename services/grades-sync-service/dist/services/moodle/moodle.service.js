"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoodleService = void 0;
const axios_1 = __importDefault(require("axios"));
class MoodleService {
    constructor() {
        this.baseURL = process.env.MOODLE_API_URL || 'http://localhost:8080';
    }
    async getCourseGrades(courseId) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/api/moodle/rest/course/${courseId}/grades-all`);
            return response.data.map(this.parseGrades);
        }
        catch (error) {
            console.error('Error fetching Moodle grades:', error);
            throw error;
        }
    }
    parseGrades(data) {
        return {
            ...data,
            gradeItems: data.gradeItems.map(item => ({
                ...item,
                grade: typeof item.grade === 'string' ? parseFloat(item.grade) || 0 : item.grade || 0
            }))
        };
    }
    async checkConnection() {
        try {
            await axios_1.default.get(`${this.baseURL}/api/moodle/site-info`, {
                timeout: 5000
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.MoodleService = MoodleService;

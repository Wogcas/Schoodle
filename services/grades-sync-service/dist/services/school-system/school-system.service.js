"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchoolSystemService = void 0;
const axios_1 = __importDefault(require("axios"));
class SchoolSystemService {
    constructor() {
        this.baseURL = process.env.SCHOOL_SYSTEM_URL || 'http://localhost:3004';
    }
    async getLatestSchoolTerm() {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/api/school-system/school-terms/latest`);
            return {
                id: response.data.id,
                termStartDate: new Date(response.data.termStartDate),
                termEndDate: new Date(response.data.termEndDate)
            };
        }
        catch (error) {
            if (error?.response?.status === 404) {
                return null;
            }
            throw new Error(`Error fetching school term: ${error?.message}`);
        }
    }
    async submitGrade(courseIdNumber, studentEmail, grade) {
        const response = await axios_1.default.post(`${this.baseURL}/api/school-system/grades/submit`, {
            courseIdNumber,
            studentEmail,
            grade
        });
        return response.data.success;
    }
    async getCoursesByTerm(termId) {
        const response = await axios_1.default.get(`${this.baseURL}/api/school-system/courses/by-term/${termId}`);
        return response.data.map(course => ({ idNumber: course.idNumber }));
    }
    async checkConnection() {
        try {
            await axios_1.default.get(`${this.baseURL}/api/school-system/info`, {
                timeout: 5000
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.SchoolSystemService = SchoolSystemService;

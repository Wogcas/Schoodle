import axios from 'axios';
import { ReportStudentGrades } from '../../models/moodle/moodle.models';

export class MoodleService {
    private readonly baseURL = process.env.MOODLE_API_URL || 'http://localhost:8080';

    async getCourseGrades(courseId: string): Promise<ReportStudentGrades[]> {
        try {
            const response = await axios.get<ReportStudentGrades[]>(
                `${this.baseURL}/api/moodle/rest/course/${courseId}/grades-all`
            );
            return response.data.map(this.parseGrades);
        } catch (error) {
            console.error('Error fetching Moodle grades:', error);
            throw error;
        }
    }

    private parseGrades(data: ReportStudentGrades): ReportStudentGrades {
        return {
            ...data,
            gradeItems: data.gradeItems.map(item => ({
                ...item,
                grade: typeof item.grade === 'string' ? parseFloat(item.grade) || 0 : item.grade || 0
            }))
        };
    }

    async checkConnection(): Promise<boolean> {
        try {
            await axios.get(`${this.baseURL}/api/moodle/site-info`, {
                timeout: 5000
            });
            return true;
        } catch (error) {
            return false;
        }
    }
}
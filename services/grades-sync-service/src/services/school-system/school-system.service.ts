import axios from 'axios';
import { SchoolTerm } from '../../models/sync-state.model';

interface SchoolTermResponse {
    id: number;
    termStartDate: string;
    termEndDate: string;
}

interface CourseResponse {
    idNumber: string;
    name: string;
}

interface SubmitGradeResponse {
    success: boolean;
    message: string;
}

export class SchoolSystemService {
    private readonly baseURL = process.env.SCHOOL_SYSTEM_URL || 'http://localhost:3004';

    async getLatestSchoolTerm(): Promise<SchoolTerm | null> {
        try {
            const response = await axios.get<SchoolTermResponse>(
                `${this.baseURL}/api/school-system/school-terms/latest`
            );

            return {
                id: response.data.id,
                termStartDate: new Date(response.data.termStartDate),
                termEndDate: new Date(response.data.termEndDate)
            };
        } catch (error: any) {
            if (error?.response?.status === 404) {
                return null;
            }
            throw new Error(`Error fetching school term: ${error?.message}`);
        }
    }

    async submitGrade(courseIdNumber: string, studentEmail: string, grade: number): Promise<boolean> {
        const response = await axios.post<SubmitGradeResponse>(
            `${this.baseURL}/api/school-system/grades/submit`,
            {
                courseIdNumber,
                studentEmail,
                grade
            }
        );
        return response.data.success;
    }

    async getCoursesByTerm(termId: number): Promise<Array<{ idNumber: string }>> {
        const response = await axios.get<CourseResponse[]>(
            `${this.baseURL}/api/school-system/courses/by-term/${termId}`
        );
        return response.data.map(course => ({ idNumber: course.idNumber }));
    }

    async checkConnection(): Promise<boolean> {
        try {
            await axios.get(`${this.baseURL}/api/school-system/info`, {
                timeout: 5000
            });
            return true;
        } catch (error) {
            return false;
        }
    }
}
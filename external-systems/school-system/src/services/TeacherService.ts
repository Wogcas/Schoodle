import TeacherRepository from "../repositories/TeacherRepository";

export default class TeacherService {
    private teacherRepository: TeacherRepository;

    constructor() {
        this.teacherRepository = new TeacherRepository();
    }

    async getCoursesWithStudents(teacherIdNumber: string) {
        try {
            return await this.teacherRepository.getTeacherCoursesWithStudents(teacherIdNumber);
        } catch (error) {
            console.error('Error fetching courses with students:', error);
            throw new Error('Could not fetch courses. Please try again later.');
        }
    }
}
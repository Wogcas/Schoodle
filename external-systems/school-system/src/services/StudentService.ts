import StudentRepository from "../repositories/StudentRepository";

export default class StudentService {
    private studentRepository: StudentRepository;

    constructor() {
        this.studentRepository = new StudentRepository();
    }

    async getStudentsByTutorIdNumber(tutorIdNumber: string) {
        try {
            return await this.studentRepository.getStudentsByTutorIdNumber(tutorIdNumber);
        } catch (error) {
            console.error('Error fetching students by tutor ID number:', error);
            throw new Error('Could not fetch students. Please try again later.');
        }
    }

    async getCurrentCourses(studentIdNumber: string) {
        try {
            return await this.studentRepository.getStudentCurrentCourses(studentIdNumber);
        } catch (error) {
            throw new Error(`Error fetching courses: ${(error as Error).message}`);
        }
    }
}
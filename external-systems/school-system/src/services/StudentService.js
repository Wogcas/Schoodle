const StudentRepository = require('../repositories/StudentRepository');
const TutorService = require('./TutorService');

class StudentService {
    async createStudent(studentData, tutorIds = []) {
        const student = await StudentRepository.create(studentData);
        if (tutorIds.length > 0) {
            await TutorService.assignTutorsToStudent(student.id, tutorIds);
        }
        return student;
    }

    async getStudentDetails(id) {
        const student = await StudentRepository.findById(id);
        if (!student) throw new Error('Estudiante no encontrado');
        
        const [tutors, enrolledTerms] = await Promise.all([
            StudentRepository.getTutors(id),
            StudentRepository.getEnrolledTerms(id)
        ]);

        return { ...student, tutors, enrolledTerms };
    }

    async getStudentCourses(enrolledTermId) {
        return await StudentRepository.getCourses(enrolledTermId);
    }
}

module.exports = new StudentService();
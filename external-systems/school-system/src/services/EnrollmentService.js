const EnrollmentRepository = require('../repositories/EnrollmentRepository');
const SchoolTermService = require('./SchoolTermService');

class EnrollmentService {
    async enrollStudentInTerm(studentId, termData) {
        const currentTerm = await SchoolTermService.getCurrentTerm();
        return await EnrollmentRepository.enrollInTerm(
            studentId,
            currentTerm.id,
            termData
        );
    }

    async enrollInCourses(enrolledTermId, courseIds) {
        if (!courseIds || courseIds.length === 0) {
            throw new Error('Debe proporcionar al menos un curso');
        }
        return await EnrollmentRepository.enrollInCourses(enrolledTermId, courseIds);
    }

    async getStudentEnrollments(studentId) {
        return await StudentRepository.getEnrolledTerms(studentId);
    }
}

module.exports = new EnrollmentService();
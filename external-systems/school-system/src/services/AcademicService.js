const EnrollmentService = require('./EnrollmentService');
const StudentService = require('./StudentService');
const CourseService = require('./CourseService');

class AcademicService {
    async fullEnrollmentProcess(studentId, termData, courseIds) {
        const enrollment = await EnrollmentService.enrollStudentInTerm(studentId, termData);
        const courses = await EnrollmentService.enrollInCourses(enrollment.id, courseIds);
        
        const student = await StudentService.getStudentDetails(studentId);
        const termDetails = await SchoolTermService.getCurrentTerm();
        
        return {
            student: student.name, 
            term: termDetails.termStartDate,
            courses: courses.map(c => c.courseId)
        };
    }

    async getStudentAcademicHistory(studentId) {
        const enrollments = await EnrollmentService.getStudentEnrollments(studentId);
        return Promise.all(enrollments.map(async enrollment => ({
            term: enrollment.termStartDate,
            courses: await StudentService.getStudentCourses(enrollment.id)
        })));
    }
}

module.exports = new AcademicService();
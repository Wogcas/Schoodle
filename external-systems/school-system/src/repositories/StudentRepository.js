const knex = require('../database/knex');

class StudentRepository {
    async create(studentData) {
        const [student] = await knex('Students').insert(studentData).returning('*');
        return student;
    }

    async update(studentId, studentData) {
        const [student] = await knex('Students')
            .where({ id: studentId })
            .update(studentData)
            .returning('*');
        return student;
    }

    async findById(id, trx = knex) {
        return await trx('Students')
            .where({ id })
            .first();
    }

    async findByEmail(email, trx = knex) {
        return await trx('Students')
            .where({ email })
            .first();
    }

    async updateCurrentGrade(studentId, gradeData, trx = knex) {
        return await trx('GradeGroup')
            .where({ studentId })
            .update(gradeData);
    }

    async getTutors(studentId) {
        return await knex('TutorsStudents')
            .join('Tutors', 'TutorsStudents.tutorId', 'Tutors.id')
            .where('TutorsStudents.studentId', studentId)
            .select('Tutors.*');
    }

    async getEnrolledTerms(studentId) {
        return await knex('EnrolledTerms')
            .where({ studentId })
            .join('SchoolTerms', 'EnrolledTerms.schoolTermId', 'SchoolTerms.id')
            .select('EnrolledTerms.*', 'SchoolTerms.termStartDate', 'SchoolTerms.termEndDate');
    }

    async getCourses(enrolledTermId) {
        return await knex('CourseTaken')
            .where({ enrolledTermId })
            .join('Courses', 'CourseTaken.courseId', 'Courses.id')
            .join('Subjects', 'Courses.subjectId', 'Subjects.id')
            .join('Teachers', 'Courses.teacherId', 'Teachers.id')
            .select(
                'Courses.id',
                'Subjects.name as subjectName',
                'Teachers.name as teacherName',
                'CourseTaken.generalScore'
            );
    }
}

module.exports = new StudentRepository();
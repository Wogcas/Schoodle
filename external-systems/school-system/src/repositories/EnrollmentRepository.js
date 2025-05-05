const knex = require('../database/knex');

class EnrollmentRepository {
    async enrollInTerm(studentId, termId, gradeData) {
        return await knex.transaction(async trx => {
            const [enrollment] = await trx('EnrolledTerms')
                .insert({
                    studentId,
                    schoolTermId: termId,
                    ...gradeData
                })
                .returning('*');

            await trx('GradeGroup')
                .insert({
                    studentId,
                    currentGrade: gradeData.gradeTaken,
                    group: gradeData.group
                })
                .onConflict('studentId')
                .merge();

            return enrollment;
        });
    }

    async enrollInCourses(enrolledTermId, courseIds) {
        return await knex.transaction(async trx => {
            const enrollments = [];
            for (const courseId of courseIds) {
                const [enrollment] = await trx('CourseTaken')
                    .insert({ enrolledTermId, courseId })
                    .returning('*');
                enrollments.push(enrollment);
            }
            return enrollments;
        });
    }
}

module.exports = new EnrollmentRepository();
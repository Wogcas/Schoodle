const knex = require('../database/knex');

class EnrolledTermRepository {
    async findById(id, trx = knex) {
        return await trx('EnrolledTerms')
            .where({ id })
            .first();
    }

    async recalculateGradeScore(enrolledTermId, trx = knex) {
        const courses = await trx('CourseTaken')
            .where({ enrolledTermId })
            .select('generalScore');

        const totalScore = courses.reduce((acc, course) => acc + course.generalScore, 0);
        const average = totalScore / courses.length;

        const [enrolledTerm] = await trx('EnrolledTerms')
            .where({ id: enrolledTermId })
            .update({ gradeScore: average })
            .returning('*');

        return enrolledTerm;
    }

    async findByStudent(studentId, trx = knex) {
        return await trx('EnrolledTerms')
            .where({ studentId });
    }

    
}

module.exports = new EnrolledTermRepository();
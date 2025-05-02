const knex = require('../database');

class StudentRepository {
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
}

module.exports = new StudentRepository();
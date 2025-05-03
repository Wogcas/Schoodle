const knex = require('../database/knex');

class CourseTakenRepository {
    async findById(id, trx = knex) {
        return await trx('CourseTaken')
            .where({ id })
            .first();
    }

    async updateGeneralScore(id, score, trx = knex) {
        const [courseTaken] = await trx('CourseTaken')
            .where({ id })
            .update({ generalScore: score })
            .returning('*');
        return courseTaken;
    }

    async findByEnrolledTerm(enrolledTermId, trx = knex) {
        return await trx('CourseTaken')
            .where({ enrolledTermId });
    }
}

module.exports = new CourseTakenRepository();
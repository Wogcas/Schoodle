const knex = require('../database/knex');

class UnitRepository {
    async findBySubject(subjectId, trx = knex) {
        return await trx('Units')
            .where({ subjectId });
    }

    async findById(id, trx = knex) {
        return await trx('Units')
            .where({ id })
            .first();
    }

    async getContributionPercentages(subjectId, trx = knex) {
        return await trx('Units')
            .where({ subjectId })
            .select('id', 'contributionPercentage');
    }
}

module.exports = new UnitRepository();
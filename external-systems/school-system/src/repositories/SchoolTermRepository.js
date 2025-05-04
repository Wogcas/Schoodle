const knex = require('../database/knex');

class SchoolTermRepository {
    async create(termData) {
        const [term] = await knex('SchoolTerms').insert(termData).returning('*');
        return term;
    }

    async getAll() {
        return await knex('SchoolTerms').orderBy('termStartDate');
    }

    async getLatest() {
        return await knex('SchoolTerms')
            .orderBy('termStartDate')
            .first();
    }
}

module.exports = new SchoolTermRepository();
const knex = require('../database');

class SubjectRepository {
    async findById(id, trx = knex) {
        return await trx('Subjects')
            .where({ id })
            .first();
    }

    async findByName(name, trx = knex) {
        return await trx('Subjects')
            .where({ name })
            .first();
    }

    async create(subjectData, trx = knex) {
        const [subject] = await trx('Subjects')
            .insert(subjectData)
            .returning('*');
        return subject;
    }
}

module.exports = new SubjectRepository();
const knex = require('../database/knex');

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

    async createWithUnits(subjectData, units) {
        return await knex.transaction(async trx => {
            const [subject] = await trx('Subjects')
                .insert(subjectData)
                .returning('*');

            for (const unit of units) {
                await trx('Units').insert({
                    ...unit,
                    subjectId: subject.id
                });
            }

            return subject;
        });
    }

    async getWithUnits(subjectId) {
        const subject = await knex('Subjects').where({ id: subjectId }).first();
        const units = await knex('Units').where({ subjectId });
        return { ...subject, units };
    }
}

module.exports = new SubjectRepository();
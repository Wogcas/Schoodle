const knex = require('../database/knex');

class TeacherRepository {
    async findById(id, trx = knex) {
        return await trx('Teachers')
            .where({ id })
            .first();
    }

    async findByEmail(email, trx = knex) {
        return await trx('Teachers')
            .where({ email })
            .first();
    }

    async create(teacherData, trx = knex) {
        const [teacher] = await trx('Teachers')
            .insert(teacherData)
            .returning('*');
        return teacher;
    }

    async update(id, teacherData, trx = knex) {
        const [teacher] = await trx('Teachers')
            .where({ id })
            .update(teacherData)
            .returning('*');
        return teacher;
    }
}

module.exports = new TeacherRepository();
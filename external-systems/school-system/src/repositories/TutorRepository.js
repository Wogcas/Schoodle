const knex = require('../database/knex');

class TutorRepository {
    // CRUD Básico
    async create(tutorData) {
        const [tutor] = await knex('Tutors').insert(tutorData).returning('*');
        return tutor;
    }

    async findById(id) {
        return await knex('Tutors').where({ id }).first();
    }

    async findByEmail(email) {
        return await knex('Tutors').where({ email }).first();
    }

    // Relación Tutors-Students
    async assignToStudent(tutorId, studentId) {
        const [relation] = await knex('TutorsStudents')
            .insert({ tutorId, studentId })
            .returning('*');
        return relation;
    }

    async getStudents(tutorId) {
        return await knex('TutorsStudents')
            .join('Students', 'TutorsStudents.studentId', 'Students.id')
            .where('TutorsStudents.tutorId', tutorId)
            .select('Students.*');
    }
}

module.exports = new TutorRepository();
const knex = require('../database/knex');

const ViolationRepository = {
    async processTransaction(callback) {
        return await knex.transaction(callback);
    },

    async createViolation(teacherId, date, trx) {
        const [violation] = await trx('GradeSubmissionViolations')
            .insert({
                teacherId,
                violationDate: date
            })
            .returning('*');
        
        return violation;
    },

    async validateUnitOwnership(courseTakenUnitId, teacherId, trx) {
        const result = await trx('CourseTakenUnits')
            .join('CourseTaken', 'CourseTaken.id', 'CourseTakenUnits.courseTakenId')
            .join('Courses', 'Courses.id', 'CourseTaken.courseId')
            .where('CourseTakenUnits.id', courseTakenUnitId)
            .andWhere('Courses.teacherId', teacherId)
            .first();

        return !!result;
    },

    async linkViolationUnit(violationId, courseTakenUnitId, trx) {
        await trx('SubmissionViolations').insert({
            violationId,
            courseTakenUnitId
        });
    }
};

module.exports = ViolationRepository;
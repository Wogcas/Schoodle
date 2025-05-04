const knex = require('../database/knex');

const GradeRepository = {
    async processTransaction(callback) {
        return await knex.transaction(callback);
    },

    async upsertCourseTakenUnit(courseTakenId, unitId, score, trx) {
        await trx('CourseTakenUnits')
            .insert({
                courseTakenId,
                unitId,
                score
            })
            .onConflict(['courseTakenId', 'unitId'])
            .merge();
    },

    async calculateGeneralScore(courseTakenId, trx) {
        const units = await trx('CourseTakenUnits')
            .select(
                'Units.contributionPercentage',
                'CourseTakenUnits.score'
            )
            .join('Units', 'CourseTakenUnits.unitId', 'Units.id')
            .where('CourseTakenUnits.courseTakenId', courseTakenId);

        return units.reduce((total, unit) => {
            return total + (unit.score * (unit.contributionPercentage / 100));
        }, 0);
    }
};

module.exports = GradeRepository;
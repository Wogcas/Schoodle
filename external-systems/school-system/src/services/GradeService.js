const GradeRepository = require('../repositories/GradeRepository');
const CourseTakenRepository = require('../repositories/CourseTakenRepository');
const EnrolledTermRepository = require('../repositories/EnrolledTermRepository');

class GradeService {
    async syncGrades(courseTakenId, units) {
        return await GradeRepository.processTransaction(async (trx) => {
            // Actualizar unidades
            for (const unit of units) {
                await GradeRepository.upsertCourseTakenUnit(
                    courseTakenId,
                    unit.unitId,
                    unit.score,
                    trx
                );
            }

            // Calcular y actualizar puntaje general
            const generalScore = await GradeRepository.calculateGeneralScore(courseTakenId, trx);
            await CourseTakenRepository.updateGeneralScore(courseTakenId, generalScore, trx);

            // Actualizar promedio del ciclo
            const courseTaken = await CourseTakenRepository.findById(courseTakenId, trx);
            const enrolledTerm = await EnrolledTermRepository.recalculateGradeScore(
                courseTaken.enrolledTermId,
                trx
            );

            return {
                courseTakenId,
                generalScore,
                enrolledTermScore: enrolledTerm.gradeScore
            };
        });
    }
}

module.exports = new GradeService();
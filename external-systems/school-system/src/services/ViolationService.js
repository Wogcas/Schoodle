const ViolationRepository = require('../repositories/ViolationRepository');
const TeacherRepository = require('../repositories/TeacherRepository');

class ViolationService {
    async reportViolation(teacherId, courseTakenUnitIds) {
        const teacher = await TeacherRepository.findById(teacherId);
        if (!teacher) throw new Error('Teacher not found');

        return await ViolationRepository.processTransaction(async (trx) => {
            const violation = await ViolationRepository.createViolation(
                teacherId,
                new Date(),
                trx
            );

            for (const ctuId of courseTakenUnitIds) {
                const isValid = await ViolationRepository.validateUnitOwnership(
                    ctuId,
                    teacherId,
                    trx
                );
                
                if (!isValid) continue; // O manejar error

                await ViolationRepository.linkViolationUnit(
                    violation.id,
                    ctuId,
                    trx
                );
            }

            return violation;
        });
    }
}

module.exports = new ViolationService();
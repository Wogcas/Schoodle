const SubjectRepository = require('../repositories/SubjectRepository');

class SubjectService {
    async getSubjectWithUnits(subjectId) {
        const subject = await SubjectRepository.getWithUnits(subjectId);
        if (!subject) throw new Error('Materia no encontrada');
        return subject;
    }

    async validateUnitsPercentage(subjectId) {
        const { units } = await this.getSubjectWithUnits(subjectId);
        const total = units.reduce((sum, unit) => sum + unit.contributionPercentage, 0);
        if (total !== 100) throw new Error('La suma de porcentajes debe ser 100%');
        return true;
    }
}

module.exports = new SubjectService();
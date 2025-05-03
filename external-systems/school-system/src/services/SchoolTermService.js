const SchoolTermRepository = require('../repositories/SchoolTermRepository');

class SchoolTermService {
    async createSchoolTerm(termData) {
        return await SchoolTermRepository.create(termData);
    }

    async getAllTerms() {
        return await SchoolTermRepository.getAll();
    }

    async getCurrentTerm() {
        const term = await SchoolTermRepository.getLatest();
        if (!term) throw new Error('No hay periodos registrados');
        return term;
    }
}

module.exports = new SchoolTermService();
const TutorRepository = require('../repositories/TutorRepository');

class TutorService {
    async createTutor(tutorData) {
        return await TutorRepository.create(tutorData);
    }

    async getTutorById(id) {
        const tutor = await TutorRepository.findById(id);
        if (!tutor) throw new Error('Tutor no encontrado');
        return tutor;
    }

    async assignTutorsToStudent(studentId, tutorIds) {
        const assignments = [];
        for (const tutorId of tutorIds) {
            assignments.push(await TutorRepository.assignToStudent(tutorId, studentId));
        }
        return assignments;
    }

    async getTutorStudents(tutorId) {
        return await TutorRepository.getStudents(tutorId);
    }
}

module.exports = new TutorService();
import ViolationRepository from '../repositories/ViolationRepository';

const violationRepository = new ViolationRepository();
export default class ViolationService {
  async reportLateSubmission(
    teacherEmail: string,
    courseIdNumber: string,
    studentEmails: string[]
  ) {
    try {
      // Validación básica
      if (!teacherEmail || !courseIdNumber || !studentEmails?.length) {
        throw new Error('Datos incompletos');
      }

      return await violationRepository.createSubmissionViolations(teacherEmail, courseIdNumber, studentEmails);
    } catch (error) {
      throw new Error(`Error al registrar violaciones: ${(error as Error).message}`);
    }
  }
}
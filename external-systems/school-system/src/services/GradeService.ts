import GradeRepository  from '../repositories/GradeRepository';

const gradeRepository = new GradeRepository();

export default class GradeService {
  async submitGrade(studentEmail: string, courseIdNumber: string, grade: number) {
    if (grade < 0 || grade > 100) {
      throw new Error('La calificación debe estar entre 0 y 100');
    }

    try {
      await gradeRepository.submitGradeTransaction(studentEmail, courseIdNumber, grade);
      return { success: true };
    } catch (error) {
      throw new Error(`Error al registrar calificación: ${(error as Error).message}`);
    }
  }
}
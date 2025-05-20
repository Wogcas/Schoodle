import { Request, Response } from 'express';
import GradeService from '../services/GradeService';

const gradeService = new GradeService();

interface GradeRequestBody {
  courseIdNumber: string;
  studentEmail: string;
  grade: number;
}

export default class GradeController {
  static async submitGrade(req: Request, res: Response): Promise<void> {
    try {
      const { courseIdNumber, studentEmail, grade } = req.body as GradeRequestBody;

      if (!courseIdNumber || !studentEmail || grade === undefined) {
        res.status(400).json({ error: 'Datos incompletos' });
        return;
      }

      await gradeService.submitGrade(studentEmail, courseIdNumber, grade);
      
      res.json({ 
        success: true,
        message: 'Calificación registrada exitosamente'
      });
      
    } catch (error) {
      const err = error as Error;
      if (err.message.includes('no encontrado')) {
        res.status(404).json({ error: err.message });
      } else {
        res.status(500).json({
          error: 'Error al procesar la calificación',
          details: err.message
        });
      }
    }
  }
}
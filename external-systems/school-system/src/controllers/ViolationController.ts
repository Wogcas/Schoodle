import { Request, Response } from 'express';
import ViolationService from '../services/ViolationService';

const violationService = new ViolationService();

interface ViolationRequest {
  teacherEmail: string;
  courseIdNumber: string;
  students: Array<{ studentEmail: string }>;
}

export default class ViolationController {
  static async reportLateSubmission(req: Request, res: Response): Promise<void> {
    try {
      const { teacherEmail, courseIdNumber, students } = req.body as ViolationRequest;
      const studentEmails = students.map(s => s.studentEmail);

      const result = await violationService.reportLateSubmission(
        teacherEmail,
        courseIdNumber,
        studentEmails
      );

      res.json({
        success: true,
        violationId: result.violationId,
        affectedStudents: result.totalStudentsAffected,
        message: `Reporte registrado con ${result.totalStudentsAffected} violaciones`
      });

    } catch (error) {
      const err = error as Error;
      res.status(err.message.includes('no encontrado') ? 404 : 500).json({
        error: 'Error en el reporte',
        details: err.message
      });
    }
  }
}
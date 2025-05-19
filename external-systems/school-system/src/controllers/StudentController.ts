import { Request, Response } from 'express';
import StudentService from '../services/StudentService';

const studentService = new StudentService();

interface GetStudentsByTutorParams {
  tutorIdNumber: string;
}

export default class StudentController {
  
  static async getStudentsByTutor(req: Request<GetStudentsByTutorParams>, res: Response): Promise<void> {
    const { tutorIdNumber } = req.params;

    if (!tutorIdNumber) {
      res.status(400).json({ error: 'Tutor ID number is required' });
      return;
    }

    try {
      const students = await studentService.getStudentsByTutorIdNumber(tutorIdNumber);
      res.json(students);
    } catch (error) {
      res.status(500).json({ 
        error: 'Error retrieving students',
        details: (error as Error).message
      });
    }
  };
}

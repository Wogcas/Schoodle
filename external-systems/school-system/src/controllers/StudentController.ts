import { Request, Response } from 'express';
import StudentService from '../services/StudentService';

const studentService = new StudentService();

interface GetStudentsByTutorParams {
  tutorIdNumber: string;
}

interface StudentParams {
  studentIdNumber: string;
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

  static async getCurrentCourses(req: Request<StudentParams>, res: Response): Promise<void> {
    const { studentIdNumber } = req.params;

    try {
      if (!studentIdNumber) {
        res.status(400).json({ error: 'Student ID number is required' });
        return;
      }

      const result = await studentService.getCurrentCourses(studentIdNumber);
      
      res.json({
        courses: result.courses,
        student: result.student
      });
      
    } catch (error) {
      const message = (error as Error).message;
      if (message.includes('not found')) {
        res.status(404).json({ error: message });
      } else {
        res.status(500).json({
          error: 'Error retrieving courses',
          details: message
        });
      }
    }
  };
}

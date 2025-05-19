import { Request, Response } from 'express';
import TeacherService from '../services/TeacherService';

const teacherService = new TeacherService();

interface TeacherParams {
    teacherIdNumber: string;
}

export default class TeacherController {
  static async getCoursesWithStudents(req: Request<TeacherParams>, res: Response): Promise<void> {
    const { teacherIdNumber } = req.params;

    try {
      if (!teacherIdNumber) {
        res.status(400).json({ error: 'Teacher ID number is required' });
        return;
      }

      const result = await teacherService.getCoursesWithStudents(teacherIdNumber);
      
      if (result.courses.length === 0) {
        res.status(404).json({ 
          message: 'No current courses found for this teacher',
          teacher: result.teacher
        });
        return;
      }

      res.json(result);
    } catch (error) {
      const message = (error as Error).message;
      if (message.includes('not found')) {
        res.status(404).json({ error: message });
      } else {
        res.status(500).json({
          error: 'Error retrieving teacher courses',
          details: message
        });
      }
    }
  }
}
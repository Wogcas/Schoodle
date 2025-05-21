import { Request, Response } from 'express';
import CourseService from '../services/CourseService';
import SchoolTermService from '../services/SchoolTermService';

const courseService = new CourseService();
const termService = new SchoolTermService();

export default class CourseController {
  static async getCoursesByTerm(req: Request, res: Response): Promise<void> {
    try {
      const termId = Number(req.params.termId);
      
      // Verificar que el período existe
      const term = await termService.getTermById(termId);
      if (!term) {
        res.status(404).json({ error: 'Período escolar no encontrado' });
        return;
      }

      const courses = await courseService.getCoursesByTermId(termId);
      
      if (courses.length === 0) {
        res.status(404).json({
          message: 'No se encontraron cursos para este período escolar',
          termId
        });
        return;
      }

      // Respuesta simplificada
      res.json(courses.map(course => ({
        idNumber: course.idNumber,
        name: course.name
      })));
      
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener los cursos',
        details: (error as Error).message
      });
    }
  }
}
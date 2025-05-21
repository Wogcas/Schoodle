import { CourseRepository } from '../repositories/CourseRepository';
import Course from '../models/Course';

const courseRepository = new CourseRepository();

export default class CourseService {
  async getCoursesByTermId(termId: number): Promise<Course[]> {
    try {
      return await courseRepository.getCoursesByTerm(termId);
    } catch (error) {
      throw new Error(`Error fetching courses: ${(error as Error).message}`);
    }
  }
}
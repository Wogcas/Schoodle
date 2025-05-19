import express from 'express';
import TeacherController from '../controllers/TeacherController';

const router = express.Router();

router.get<{ teacherIdNumber: string }>(
  '/:teacherIdNumber/courses-with-students',
  TeacherController.getCoursesWithStudents
);

export default router;
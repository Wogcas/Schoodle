import express from 'express';
import  StudentController  from '../controllers/StudentController';

const router = express.Router();

router.get<{ tutorIdNumber: string }>(
  '/by-tutor/:tutorIdNumber',
  StudentController.getStudentsByTutor
);

router.get<{ studentIdNumber: string }>(
  '/:studentIdNumber/current-courses',
  StudentController.getCurrentCourses
);

export default router;
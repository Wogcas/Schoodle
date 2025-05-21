import express from 'express';
import CourseController from '../controllers/CourseController';

const router = express.Router();

router.get('/by-term/:termId', CourseController.getCoursesByTerm);

export default router;
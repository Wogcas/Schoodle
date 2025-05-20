import express from 'express';
import GradeController from '../controllers/GradeController';

const router = express.Router();

router.post('/submit', GradeController.submitGrade);

export default router;
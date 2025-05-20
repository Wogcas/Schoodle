import express from 'express';
import ViolationController from '../controllers/ViolationController';

const router = express.Router();

router.post('/late-submission', ViolationController.reportLateSubmission);

export default router;
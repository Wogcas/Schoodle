import express from 'express';
import SchoolTermController from '../controllers/SchoolTermController';

const router = express.Router();

router.get('/latest', SchoolTermController.getLatestTerm);

export default router;
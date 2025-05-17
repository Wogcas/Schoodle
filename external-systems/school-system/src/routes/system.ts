import express from 'express';
const router = express.Router();
import SystemController from '../controllers/SystemController';

router.get('/info', SystemController.getInfo);

export default router;
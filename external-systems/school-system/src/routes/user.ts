import express from 'express';
import UserController from '../controllers/UserController';

const router = express.Router();

router.get('/first-registered', UserController.getFirstRegisteredUser);

export default router;
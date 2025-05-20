import express from 'express';
import UserController from '../controllers/UserController';

const router = express.Router();

router.get('/first-registered', UserController.getFirstRegisteredUser);
router.get('/registered-since', UserController.getUsersRegisteredSince)

export default router;
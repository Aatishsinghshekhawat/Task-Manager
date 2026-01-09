import express from 'express';
import { register, login, logout, getMe, getUsers } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.get('/users', protect, getUsers);

export default router;

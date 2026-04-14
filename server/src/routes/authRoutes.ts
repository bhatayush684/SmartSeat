import express from 'express';
import { registerUser, loginUser, getMe, getAllUsers, updateUserRole, deleteUser } from '../controllers/authController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/', protect, admin, getAllUsers);
router.patch('/:id/role', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser);

export default router;

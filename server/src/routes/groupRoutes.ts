import express from 'express';
import { 
  createGroup, 
  joinGroup, 
  getUserGroups,
  getAllGroupsAdmin
} from '../controllers/groupController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createGroup);
router.post('/join', protect, joinGroup);
router.get('/my', protect, getUserGroups);

// Admin routes
router.get('/admin/all', protect, admin, getAllGroupsAdmin);

export default router;

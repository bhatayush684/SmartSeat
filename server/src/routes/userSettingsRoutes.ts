import express from 'express';
import { 
  getUserSettings, 
  updateUserSettings, 
  updateUserProfile, 
  changePassword 
} from '../controllers/userSettingsController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect); // All user settings routes require authentication

router.get('/settings', getUserSettings);
router.put('/settings', updateUserSettings);
router.put('/profile', updateUserProfile);
router.put('/change-password', changePassword);

export default router;

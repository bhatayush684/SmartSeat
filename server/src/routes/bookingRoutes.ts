import express from 'express';
import { 
  createBooking, 
  getUserBookings, 
  getAllBookingsDate, 
  cancelBooking, 
  checkInBooking,
  markNoShow,
  getAllBookingsAdmin, 
  getStatsAdmin,
  getConflictsAdmin 
} from '../controllers/bookingController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getUserBookings);
router.get('/map', getAllBookingsDate); // Public or protect? Let's protect
router.delete('/:id', protect, cancelBooking);
router.patch('/:id/checkin', protect, checkInBooking);
router.patch('/:id/noshow', protect, admin, markNoShow);

// Admin routes
router.get('/admin/all', protect, admin, getAllBookingsAdmin);
router.get('/admin/stats', protect, admin, getStatsAdmin);
router.get('/admin/conflicts', protect, admin, getConflictsAdmin);

export default router;

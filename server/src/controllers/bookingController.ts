import { Request, Response } from 'express';
import { Booking } from '../models/Booking';
import { ActivityLog } from '../models/ActivityLog';

export const createBooking = async (req: Request, res: Response) => {
  const { seatId, location, timeSlot, date } = req.body;
  const user = (req as any).user;

  try {
    // Check limit (max 2 per day per user)
    const todayBookings = await Booking.find({ student: user._id, date, status: 'active' });
    if (todayBookings.length >= 2) {
      return res.status(400).json({ message: 'Max 2 bookings per day reached' });
    }

    // Check if seat is already booked for this slot
    const existing = await Booking.findOne({ location, timeSlot, date, seatId, status: 'active' });
    if (existing) {
      return res.status(400).json({ message: 'Seat is already booked for this time slot' });
    }

    const booking = await Booking.create({
      student: user._id,
      seatId,
      location,
      timeSlot,
      date,
      status: 'active'
    });

    res.status(201).json(booking);
  } catch (error: any) {
    if (error.code === 11000) {
      // Log conflict for admin analytics
      await ActivityLog.create({
        user: user._id,
        action: 'conflict',
        resource: 'booking',
        details: { seatId, location, timeSlot, date, type: 'simultaneous_attempt' },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      // Duplicate key error caused by simultaneous booking race condition
      return res.status(409).json({ message: 'Seat was just booked by someone else! Please choose another seat.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserBookings = async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const bookings = await Booking.find({ student: user._id }).sort({ date: -1, createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllBookingsDate = async (req: Request, res: Response) => {
  const { location, date } = req.query;
  try {
    const query: any = { status: 'active' };
    if (location) query.location = location;
    if (date) query.date = date;
    
    // For seat map we just need what is booked
    const bookings = await Booking.find(query);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.student.toString() !== user._id.toString() && user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const checkInBooking = async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.student.toString() !== user._id.toString() && user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (booking.status !== 'active') {
      return res.status(400).json({ message: `Cannot check in a booking with status: ${booking.status}` });
    }

    booking.status = 'checked-in';
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllBookingsAdmin = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({}).populate('student', 'name email').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const markNoShow = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'no-show';
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStatsAdmin = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: 'active' });
    const todayBookings = await Booking.countDocuments({ date: today, status: 'active' });
    const checkedInBookings = await Booking.countDocuments({ status: 'checked-in' });
    const noShowBookings = await Booking.countDocuments({ status: 'no-show' });
    
    res.json({
      totalBookings,
      activeBookings,
      todayBookings,
      checkedInBookings,
      noShowBookings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const getConflictsAdmin = async (req: Request, res: Response) => {
  try {
    const conflicts = await ActivityLog.find({ action: 'conflict' }).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(conflicts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

import mongoose, { Schema } from 'mongoose';

const bookingSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  seatId: { type: String, required: true },
  location: { type: String, enum: ['library', 'lab'], required: true },
  timeSlot: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  status: { type: String, enum: ['active', 'checked-in', 'no-show', 'cancelled', 'completed'], default: 'active' },
  checkInTime: { type: Date },
  checkOutTime: { type: Date },
  notes: { type: String },
  groupId: { type: Schema.Types.ObjectId, ref: 'Group' }
}, {
  timestamps: true
});

// Create a compound unique index to ensure a seat cannot be booked twice simultaneously
bookingSchema.index(
  { location: 1, timeSlot: 1, date: 1, seatId: 1 }, 
  { unique: true, partialFilterExpression: { status: { $in: ['active', 'checked-in'] } } }
);

export const Booking = mongoose.model('Booking', bookingSchema);

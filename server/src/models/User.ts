import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  avatar: { type: String },
  department: { type: String, enum: ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'General'] },
  year: { type: String, enum: ['1st', '2nd', '3rd', '4th'] },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  loginCount: { type: Number, default: 0 },
  noShowCount: { type: Number, default: 0 },
  totalBookings: { type: Number, default: 0 },
  emailVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, {
  timestamps: true
});

export const User = mongoose.model('User', userSchema);

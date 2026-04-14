import mongoose, { Schema } from 'mongoose';

const userSettingsSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    bookingReminders: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: false },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'UTC' }
  },
  profile: {
    bio: { type: String },
    phone: { type: String },
    emergencyContact: { type: String },
    dietaryRestrictions: { type: [String] }
  },
  academic: {
    studentId: { type: String },
    program: { type: String },
    graduationYear: { type: Number }
  }
}, {
  timestamps: true
});

export const UserSettings = mongoose.model('UserSettings', userSettingsSchema);

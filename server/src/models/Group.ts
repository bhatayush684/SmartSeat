import mongoose, { Schema } from 'mongoose';

const groupSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 50 },
  code: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String, maxlength: 200 },
  maxMembers: { type: Number, required: true, min: 2, max: 8, default: 4 },
  creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  memberIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true },
  isPrivate: { type: Boolean, default: false },
  tags: [{ type: String, maxlength: 20 }],
  studySubject: { type: String, maxlength: 100 },
  meetingFrequency: { type: String, enum: ['daily', 'weekly', 'bi-weekly', 'monthly', 'one-time'] },
  nextMeeting: {
    location: { type: String, enum: ['library', 'lab'] },
    timeSlot: { type: String },
    date: { type: String }
  },
  seatIds: [{ type: String }],
  rules: [{ type: String, maxlength: 100 }]
}, {
  timestamps: true
});

export const Group = mongoose.model('Group', groupSchema);

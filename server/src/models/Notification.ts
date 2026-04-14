import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['booking', 'system', 'reminder', 'warning', 'success'], required: true },
  read: { type: Boolean, default: false },
  actionUrl: { type: String },
  actionText: { type: String },
  metadata: { type: Schema.Types.Mixed }
}, {
  timestamps: true
});

export const Notification = mongoose.model('Notification', notificationSchema);

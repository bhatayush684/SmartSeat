import mongoose, { Schema } from 'mongoose';

const activityLogSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  resourceId: { type: Schema.Types.ObjectId },
  details: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String }
}, {
  timestamps: true
});

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

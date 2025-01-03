import mongoose, { Schema, Document } from 'mongoose';

export enum NotificationType {
  FRIEND_REQUEST = 'friend_request',
  LIKE = 'like',
  COMMENT = 'comment',
  MESSAGE = 'message',
}

export interface INotification extends Document {
  userId: mongoose.Schema.Types.ObjectId; // User who receives the notification
  type: NotificationType; // Type of notification
  message: string; // Notification message
  read: boolean; // Whether the notification is read
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: Object.values(NotificationType), required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>('Notification', NotificationSchema);
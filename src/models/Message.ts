import mongoose, { Schema, Document } from 'mongoose';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VOICE = 'voice',
  LOCATION = 'location',
}

export interface IMessage extends Document {
  sender: mongoose.Schema.Types.ObjectId; // User who sent the message
  receiver: mongoose.Schema.Types.ObjectId; // User who received the message
  content: string; // Message content (text, file path, or location coordinates)
  type: MessageType; // Type of message (text, image, voice, location)
  read: boolean; // Whether the message is read
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    type: { type: String, enum: Object.values(MessageType), default: MessageType.TEXT },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>('Message', MessageSchema);
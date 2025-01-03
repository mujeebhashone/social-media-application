import mongoose, { Schema, Document } from 'mongoose';

export interface IShare extends Document {
  sharedBy: mongoose.Schema.Types.ObjectId; // User who shared
  post: mongoose.Schema.Types.ObjectId; // Post which was shared
  createdAt: Date;
}

const ShareSchema: Schema = new Schema(
  {
    sharedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IShare>('Share', ShareSchema);
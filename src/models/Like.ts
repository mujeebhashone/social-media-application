import mongoose, { Schema, Document } from 'mongoose';

export interface ILike extends Document {
  likedBy: mongoose.Schema.Types.ObjectId; // User who liked
  post: mongoose.Schema.Types.ObjectId; // Post which was liked
  createdAt: Date;
}

const LikeSchema: Schema = new Schema(
  {
    likedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ILike>('Like', LikeSchema);
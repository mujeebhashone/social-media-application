import mongoose, { Schema, Document } from 'mongoose';

export enum PostVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FRIENDS = 'friends',
}

export interface IPost extends Document {
  content: string;
  postedBy: mongoose.Schema.Types.ObjectId;
  media?: string; // Media file (image or video)
  likes: mongoose.Schema.Types.ObjectId[];
  shares: mongoose.Schema.Types.ObjectId[];
  comments: mongoose.Schema.Types.ObjectId[];
  visibility: PostVisibility;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    media: { type: String }, // Media file path
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    shares: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    visibility: { type: String, enum: Object.values(PostVisibility), default: PostVisibility.PUBLIC },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>('Post', PostSchema);
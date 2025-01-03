import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  content: string;
  commentedBy: mongoose.Schema.Types.ObjectId; // User who commented
  post: mongoose.Schema.Types.ObjectId; // Post on which commented
  createdAt: Date;
  updatedAt: Date;
  image?: string;
  likes: mongoose.Schema.Types.ObjectId[];

}

const CommentSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    image: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  },
  { timestamps: true }
);

export default mongoose.model<IComment>('Comment', CommentSchema);
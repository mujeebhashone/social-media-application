import { Request, Response } from 'express';
import Comment from '../models/Comment';
import { CustomError } from '../utils/customError';
import Post from '../models/Post';
import { Schema } from 'mongoose';

export const addComment = async (req: Request, res: Response) => {
  try {
    const { content, postId } = req.body;
    const commentedBy = req.user?.id;
    const image = req.file?.path;

    const comment = new Comment({ content, commentedBy, post: postId, image });
    await comment.save();

    // Add comment to the post
    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};


export const likeComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.body;
    const likedBy = req.user?.id;

    if (!likedBy) {
      throw new CustomError('User not authenticated', 401);
    }

    // Check if already liked
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new CustomError('Comment not found', 404);
    }

    if (comment.likes.map(id => id.toString()).includes(likedBy)) {
      throw new CustomError('You have already liked this comment', 400);
    }

    // Add like to the comment
    comment.likes.push(new Schema.Types.ObjectId(likedBy));
    await comment.save();

    res.status(200).json({ message: 'Comment liked successfully', comment });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};
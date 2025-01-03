import { Request, Response } from 'express';
import Like from '../models/Like';
import { CustomError } from '../utils/customError';
import Post from '../models/Post';

export const likePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    const likedBy = req.user?.id; // User ID from auth middleware

    // Check if already liked
    const existingLike = await Like.findOne({ post: postId, likedBy });
    if (existingLike) {
      throw new CustomError('You have already liked this post', 400);
    }

    const like = new Like({ likedBy, post: postId });
    await like.save();

    // Add like to the post
    await Post.findByIdAndUpdate(postId, { $push: { likes: like._id } });

    res.status(201).json({ message: 'Post liked successfully', like });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};
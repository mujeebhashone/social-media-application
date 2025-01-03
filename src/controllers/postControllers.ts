import { Request, Response } from 'express';
import Post from '../models/Post';
import { CustomError } from '../utils/customError';

import User from '../models/User';

export const createPost = async (req: Request, res: Response) => {
    try {
      const { content } = req.body;
      const postedBy = req.user?.id; // User ID from auth middleware
      const media = req.file?.path; // Media file path
  
      const post = new Post({ content, postedBy, media });
      await post.save();
  
      if (!postedBy) {
        throw new CustomError('User not authenticated', 401);
      }
      
      // Notification send karein
     
  
      res.status(201).json({ message: 'Post created successfully', post });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Server Error' });
      }
    }
  };

export const getPost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate('postedBy', 'name email')
      .populate('likes', 'name')
      .populate('shares', 'name')
      .populate({
        path: 'comments',
        populate: { path: 'commentedBy', select: 'name email' },
      });

    if (!post) {
      throw new CustomError('Post not found', 404);
    }

    const user = await User.findById(post.postedBy);
    if (
      post.visibility === 'private' &&
      post.postedBy.toString() !== req.user?.id
    ) {
      throw new CustomError('You do not have permission to view this post', 403);
    }

    if (
      post.visibility === 'friends' &&
      (!req.user?.id || !user?.friends.some(friend => friend.toString() === req.user?.id)) &&
      post.postedBy.toString() !== req.user?.id
    ) {
      throw new CustomError('You do not have permission to view this post', 403);
    }

    res.status(200).json({ post });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};
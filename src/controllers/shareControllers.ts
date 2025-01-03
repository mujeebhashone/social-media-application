import { Request, Response } from 'express';
import Share from '../models/Share';
import { CustomError } from '../utils/customError';
import Post from '../models/Post';

export const sharePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    const sharedBy = req.user?.id; // User ID from auth middleware

    const share = new Share({ sharedBy, post: postId });
    await share.save();

    // Add share to the post
    await Post.findByIdAndUpdate(postId, { $push: { shares: share._id } });

    res.status(201).json({ message: 'Post shared successfully', share });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};
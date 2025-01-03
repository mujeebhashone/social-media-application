import { Request, Response } from 'express';
import User from '../models/User';
import FriendRequest from '../models/FreindRequest';
import { CustomError } from '../utils/customError';
import { Types } from 'mongoose';

export const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const senderId = req.user?.id;

    if (!senderId) {
      throw new CustomError('Not authenticated', 401);
    }

    // Check if request already exists
    const existingRequest = await FriendRequest.findOne({
      senderId,
      receiverId: userId,
      status: 'pending'
    });

    if (existingRequest) {
      throw new CustomError('Friend request already sent', 400);
    }

    // Create new friend request
    const friendRequest = new FriendRequest({
      senderId,
      receiverId: userId,
      status: 'pending'
    });

    await friendRequest.save();

    res.status(200).json({ message: 'Friend request sent successfully', friendRequest });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

export const acceptFriendRequest = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.body;
    const userId = req.user?.id;

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest || friendRequest.receiverId?.toString() !== userId) {
      throw new CustomError('Friend request not found', 404);
    }

    // Update request status
    friendRequest.status = 'accepted';
    await friendRequest.save();

    // Add users to each other's friends lists
    await User.findByIdAndUpdate(friendRequest.senderId, {
      $push: { friends: friendRequest.receiverId }
    });

    await User.findByIdAndUpdate(friendRequest.receiverId, {
      $push: { friends: friendRequest.senderId }
    });

    res.status(200).json({ message: 'Friend request accepted', friendRequest });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

export const getPendingFriendRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const requests = await FriendRequest.find({
      receiverId: userId,
      status: 'pending'
    }).populate('senderId', 'name email');

    res.status(200).json({ pendingRequests: requests });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

export const getSentFriendRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const requests = await FriendRequest.find({
      senderId: userId,
      status: 'pending'
    }).populate('receiverId', 'name email');

    res.status(200).json({ sentRequests: requests });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

export const getAcceptedFriends = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId).populate('friends', 'name email');
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    res.status(200).json({ friends: user.friends });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};
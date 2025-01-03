import { Request, Response } from 'express';
import User, { IUser } from '../models/User'; 
import { CustomError } from '../utils/customError'; 

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, age } = req.body;
    if (!name || !email || !age) {
      throw new CustomError('Please provide all fields', 400);
    }
    const user = new User({ name, email, age });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const uploadProfilePhoto = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const profilePhoto = req.file?.path;

      if (!profilePhoto) {
        throw new CustomError('No file uploaded', 400);
      }
  
      const user = await User.findByIdAndUpdate(
        userId,
        { profilePhoto },
        { new: true }
      );
  
      if (!user) {
        throw new CustomError('User not found', 404);
      }
  
      res.status(200).json({ message: 'Profile photo uploaded successfully', user });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Server Error' });
      }
    }
  };


  export const updateUser = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const { name, email } = req.body;
  
      const user = await User.findByIdAndUpdate(userId, {name, email}, {
        new: true,
      });
  
      if (!user) {
        throw new CustomError('User not found', 404);
      }
  
      res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Server Error' });
      }
    }
  };


  export const GetCurrentUser = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const user = await User.findById(userId);
      res.status(200).json({ message: 'User fetched successfully', user });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Server Error' });
      }
    }
  };
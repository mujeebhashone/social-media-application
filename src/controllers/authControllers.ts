import { Request, Response } from 'express';
import { Document } from 'mongoose';

import { hashPassword, comparePassword, generateToken } from '../utils/authUtils';
import { CustomError } from '../utils/customError';
import userModel, { IUser, UserRole } from '../models/User';

export const register = async (req: Request, res: Response) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body;
  
      // Validate required fields
      if (!name || !email || !password) {
        throw new CustomError('Please provide name, email and password', 400);
      }

      // Check if user already exists
      const existingUser = await userModel.findOne({ email }).select('-password');
      if (existingUser) {
        throw new CustomError('User already exists', 400);
      }
  
      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create new user
      const user = new userModel({
        name,
        email,
        password: hashedPassword,
        role: UserRole.USER // Set default role
      });
  
      await user.save();
  
      // Get user without password field
      const savedUser = await userModel.findById(user._id).select('-password');
  
      // Response without password
      res.status(201).json({ 
        message: 'User registered successfully', 
        user: savedUser
      });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        console.error('Registration Error:', err); // Add this for debugging
        res.status(500).json({ message: 'Server Error' });
      }
    }
};

  

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await userModel.findOne({ email }) as (Document & IUser) | null;
    if (!user) {
      throw new CustomError('Invalid email or password', 400);
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new CustomError('Invalid email or password', 400);
    }

    // Generate token
    const token = generateToken(user._id as string, user.role as UserRole);

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};
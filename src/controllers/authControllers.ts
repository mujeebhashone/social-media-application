import crypto from 'crypto';
import { Request, Response } from 'express';
import { Document } from 'mongoose';

import { hashPassword, comparePassword, generateToken } from '../utils/authUtils';
import { CustomError } from '../utils/customError';
import userModel, { IUser, UserRole } from '../models/User';
import { sendResetPasswordEmail } from '../utils/emailService';
import { logger } from '../utils/logger';

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

// forgot password logic
// send email to user with password reset link
// generate a token and send it to the user's email
// redirect to the password reset page
// redirect to the login page
//make sure to use the correct email template
//write the email template in the emailTemplates folder
//write a code to follow the flow of the forgot password process
 

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new CustomError('Please provide an email address', 400);
    }

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Log for debugging (remove in production)
    logger(null, null, `Reset token generated for ${email}: ${resetToken}`);
    logger(null, null, `Reset URL: ${resetUrl}`);

    // Send email
    await sendResetPasswordEmail(email, resetUrl);

    res.status(200).json({
      message: 'Password reset link sent to email',
      // Only in development, remove in production
      debug: {
        resetToken,
        resetUrl
      }
    });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.error('Forgot Password Error:', err);
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    // Log the request body for debugging (remove in production)
    logger(null, null, `Reset password request received: ${JSON.stringify({ token: token ? 'exists' : 'missing', password: password ? 'exists' : 'missing' })}`);

    // Validate input
    if (!token) {
      throw new CustomError('Reset token is required', 400);
    }
    if (!password) {
      throw new CustomError('New password is required', 400);
    }

    // Find user with valid reset token and not expired
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new CustomError('Invalid or expired reset token', 400);
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update user's password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // Generate new login token
    const loginToken = generateToken(user._id.toString(), user.role as UserRole);

    res.status(200).json({
      message: 'Password reset successful',
      token: loginToken
    });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.error('Reset Password Error:', err);
      res.status(500).json({ message: 'Server Error' });
    }
  }
};
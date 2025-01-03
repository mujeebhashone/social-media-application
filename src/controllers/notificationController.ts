import { Request, Response } from 'express';
import { createNotification, markNotificationAsRead, getUserNotifications } from '../services/notificationService';
import { CustomError } from '../utils/customError';

export const sendNotification = async (req: Request, res: Response) => {
  try {
    const { userId, type, message } = req.body;
    const notification = await createNotification(userId, type, message);
    res.status(201).json({ message: 'Notification sent successfully', notification });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.body;
    const notification = await markNotificationAsRead(notificationId);
    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // User ID from auth middleware
    if (!userId) {
      throw new CustomError('User not authenticated', 401);
    }
    const notifications = await getUserNotifications(userId);
    res.status(200).json({ notifications });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};
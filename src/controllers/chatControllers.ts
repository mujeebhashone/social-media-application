import { Request, Response } from 'express';
import { sendMessage, markMessageAsRead, getMessages } from '../services/chatService';
import { CustomError } from '../utils/customError';
import { getIO } from '../utils/socket';
import upload from '../middlewares/upload';

export const sendTextMessage = async (req: Request, res: Response) => {
  try {
    const { receiver, content } = req.body;
    const sender = req.user?.id; // User ID from auth middleware

    const message = await sendMessage(sender as string, receiver, content, 'text');

    // Emit the message to the receiver
    const io = getIO();
    io.to(receiver).emit('newMessage', message);

    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

export const sendImageMessage = async (req: Request, res: Response) => {
  try {
    const { receiver } = req.body;
    const sender = req.user?.id; // User ID from auth middleware
    const image = req.file?.path; // Image file path

    if (!image) {
      throw new CustomError('No file uploaded', 400);
    }

    const message = await sendMessage(sender as string, receiver, image, 'image');

    // Emit the message to the receiver
    const io = getIO();
    io.to(receiver).emit('newMessage', message);

    res.status(201).json({ message: 'Image sent successfully', data: message });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

export const sendVoiceMessage = async (req: Request, res: Response) => {
  try {
    const { receiver } = req.body;
    const sender = req.user?.id; // User ID from auth middleware
    const voice = req.file?.path; // Voice file path

    if (!voice) {
      throw new CustomError('No file uploaded', 400);
    }

    const message = await sendMessage(sender as string, receiver, voice, 'voice');

    // Emit the message to the receiver
    const io = getIO();
    io.to(receiver).emit('newMessage', message);

    res.status(201).json({ message: 'Voice message sent successfully', data: message });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

export const sendLocationMessage = async (req: Request, res: Response) => {
  try {
    const { receiver, latitude, longitude } = req.body;
    const sender = req.user?.id; // User ID from auth middleware

    const location = `${latitude},${longitude}`;
    const message = await sendMessage(sender as string, receiver, location, 'location');

    // Emit the message to the receiver
    const io = getIO();
    io.to(receiver).emit('newMessage', message);

    res.status(201).json({ message: 'Location sent successfully', data: message });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

export const markMessageAsReadHandler = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.body;
    const message = await markMessageAsRead(messageId);
    res.status(200).json({ message: 'Message marked as read', data: message });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

export const getMessagesHandler = async (req: Request, res: Response) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user?.id; // User ID from auth middleware

    const messages = await getMessages(userId as string, otherUserId as string);
    res.status(200).json({ messages });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};
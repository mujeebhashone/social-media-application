import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';

import { logger } from './middlewares/logger';
import { auth } from './middlewares/auth';
import { validateRequest } from './middlewares/validateRequest';
import Joi from 'joi';
import path from 'path';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './utils/errorHandler';
import { notFound } from './utils/notFound';
import { connectDB } from './config/database';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import likeRoutes from './routes/likeRoutes';
import shareRoutes from './routes/shareRoutes';
import { swaggerSetup } from './utils/swagger';
import notificationRoutes from './routes/notificationRoutes';
import friendRoutes from './routes/friendRoutes';
import chatRoutes from './routes/chatRoutes';

dotenv.config();

const app = express();

connectDB();

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/shares', shareRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/friends', friendRoutes );
app.use('/api/chat', chatRoutes);

// Protected Route Example
app.get('/api/protected', auth(['admin']), (req, res) => {
  res.json({ message: 'This is a protected route' });
});

// Validate Request Example
const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  age: Joi.number().required(),
});

app.post('/api/validate', validateRequest(userSchema), (req, res) => {
  res.json({ message: 'Request is valid', data: req.body });
});

// Then initialize swagger at the end, before error handlers
swaggerSetup(app);

// 404 Error Handling
app.use(notFound);

// General Error Handling
app.use(errorHandler);



export default app;

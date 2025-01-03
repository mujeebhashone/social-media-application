import express from 'express';
import {
  sendTextMessage,
  sendImageMessage,
  sendVoiceMessage,
  sendLocationMessage,
  markMessageAsReadHandler,
  getMessagesHandler,
} from '../controllers/chatControllers';
import { auth } from '../middlewares/auth';
import upload from '../middlewares/upload';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat management
 */

/**
 * @swagger
 * /api/chat/text:
 *   post:
 *     summary: Send a text message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiver
 *               - content
 *             properties:
 *               receiver:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/text', auth(['user', 'admin']), sendTextMessage);

/**
 * @swagger
 * /api/chat/image:
 *   post:
 *     summary: Send an image message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - receiver
 *               - image
 *             properties:
 *               receiver:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image sent successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/image', auth(['user', 'admin']), upload.single('image'), sendImageMessage);

/**
 * @swagger
 * /api/chat/voice:
 *   post:
 *     summary: Send a voice message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - receiver
 *               - voice
 *             properties:
 *               receiver:
 *                 type: string
 *               voice:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Voice message sent successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/voice', auth(['user', 'admin']), upload.single('voice'), sendVoiceMessage);

/**
 * @swagger
 * /api/chat/location:
 *   post:
 *     summary: Send a location message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiver
 *               - latitude
 *               - longitude
 *             properties:
 *               receiver:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       201:
 *         description: Location sent successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/location', auth(['user', 'admin']), sendLocationMessage);

/**
 * @swagger
 * /api/chat/read:
 *   post:
 *     summary: Mark a message as read
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - messageId
 *             properties:
 *               messageId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message marked as read
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/read', auth(['user', 'admin']), markMessageAsReadHandler);

/**
 * @swagger
 * /api/chat/messages/{otherUserId}:
 *   get:
 *     summary: Get messages between two users
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: otherUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the other user
 *     responses:
 *       200:
 *         description: List of messages
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/messages/:otherUserId', auth(['user', 'admin']), getMessagesHandler);

export default router;
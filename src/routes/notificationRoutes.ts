import express from 'express';
import { sendNotification, markAsRead, getNotifications } from '../controllers/notificationController';
import { auth } from '../middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management
 */

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Send a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - type
 *               - message
 *             properties:
 *               userId:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [friend_request, like, comment, message]
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notification sent successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', auth(['user', 'admin']), sendNotification);

/**
 * @swagger
 * /api/notifications/read:
 *   post:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - notificationId
 *             properties:
 *               notificationId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/read', auth(['user', 'admin']), markAsRead);

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications for a user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', auth(['user', 'admin']), getNotifications);

export default router;
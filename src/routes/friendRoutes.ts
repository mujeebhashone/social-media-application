import express from 'express';
import {
  sendFriendRequest,
  acceptFriendRequest,
  getPendingFriendRequests,
  getSentFriendRequests,
  getAcceptedFriends,
} from '../controllers/friendControllers';
import { auth } from '../middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Friends
 *   description: Friend request management
 */

/**
 * @swagger
 * /api/friends/request:
 *   post:
 *     summary: Send a friend request
 *     tags: [Friends]
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
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Friend request sent successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/request', auth(['user', 'admin']), sendFriendRequest);

/**
 * @swagger
 * /api/friends/accept:
 *   post:
 *     summary: Accept a friend request
 *     tags: [Friends]
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
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Friend request accepted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/accept', auth(['user', 'admin']), acceptFriendRequest);

/**
 * @swagger
 * /api/friends/pending:
 *   get:
 *     summary: Get pending friend requests
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending friend requests
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/pending', auth(['user', 'admin']), getPendingFriendRequests);

/**
 * @swagger
 * /api/friends/sent:
 *   get:
 *     summary: Get sent friend requests
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sent friend requests
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/sent', auth(['user', 'admin']), getSentFriendRequests);

/**
 * @swagger
 * /api/friends/accepted:
 *   get:
 *     summary: Get accepted friends
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of accepted friends
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/accepted', auth(['user', 'admin']), getAcceptedFriends);

export default router;
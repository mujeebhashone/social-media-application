import express from 'express';
import { likePost } from '../controllers/likeControllers';
import { auth } from '../middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Post likes management
 */

/**
 * @swagger
 * /api/likes:
 *   post:
 *     summary: Like a post
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *             properties:
 *               postId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post liked successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', auth(['user', 'admin']), likePost);

export default router;
import express from 'express';
import { sharePost } from '../controllers/shareControllers';
import { auth } from '../middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Shares
 *   description: Post shares management
 */

/**
 * @swagger
 * /api/shares:
 *   post:
 *     summary: Share a post
 *     tags: [Shares]
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
 *         description: Post shared successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', auth(['user', 'admin']), sharePost);

export default router;
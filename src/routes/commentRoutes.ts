import express from 'express';
import { addComment, likeComment } from '../controllers/commentControllers';
import { auth } from '../middlewares/auth';
import upload from '../middlewares/upload';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Post comments management
 */

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - postId
 *             properties:
 *               content:
 *                 type: string
 *               postId:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', auth(['user', 'admin']), upload.single('image'), addComment);

/**
 * @swagger
 * /api/comments/like:
 *   post:
 *     summary: Like a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - commentId
 *             properties:
 *               commentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment liked successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.post('/like', auth(['user', 'admin']), likeComment);

export default router;
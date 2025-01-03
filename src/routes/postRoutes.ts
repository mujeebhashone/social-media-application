import express from 'express';
import { createPost, getPost } from '../controllers/postControllers';
import { auth } from '../middlewares/auth';
import upload from '../middlewares/upload';

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
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
 *             properties:
 *               content:
 *                 type: string
 *               media:
 *                 type: string
 *                 format: binary
 *               visibility:
 *                 type: string
 *                 enum: ['public', 'private', 'friends']
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', auth(['user', 'admin']), upload.single('media'), createPost);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post details
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/:id', auth(['user', 'admin']), getPost);

export default router;
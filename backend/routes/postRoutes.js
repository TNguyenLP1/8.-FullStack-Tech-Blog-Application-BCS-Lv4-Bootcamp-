import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getposts, createpost, updatepost, deletepost } from '../controllers/postController.js';

const router = express.Router();

router.get('/', getposts);           // all posts
router.post('/', authMiddleware, createpost);
router.put('/:id', authMiddleware, updatepost);
router.delete('/:id', authMiddleware, deletepost);

export default router;
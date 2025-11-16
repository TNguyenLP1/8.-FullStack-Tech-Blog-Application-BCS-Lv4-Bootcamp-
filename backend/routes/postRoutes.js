import express from 'express';
import { getPosts, getPostById, createPost, updatePost, deletePost } from '../controllers/postController.js';

const router = express.Router();

router.get('/', getPosts);           // all posts
router.get('/:id', getPostById);     // single post by ID
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;
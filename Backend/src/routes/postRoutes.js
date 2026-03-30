
import express from 'express';
import { createPost, getPosts, getPostById,updatePost, deletePost } from '../controllers/postController.js';
import upload from '../config/cloudinary.js'
import { protect,authorize } from '../middlewares/authMiddleware.js'; // Auth protection

const router = express.Router();

// --- Public Routes ---
router.get('/', getPosts);
router.get('/:id', getPostById);

// --- Protected Routes (Admin/Author Only) --
router.post('/', protect, authorize('Administrator', 'Editor', 'Author'), upload.single('image'), createPost);
router.put('/:id', protect, authorize('Administrator', 'Editor', 'Author'), upload.single('image'), updatePost);
router.delete('/:id', protect, authorize('Administrator', 'Editor'), deletePost);




export default router;
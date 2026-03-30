import express from 'express';
import upload from '../config/cloudinary.js'; 
import { getAllMedia, uploadMedia, deleteMedia } from '../controllers/mediaController.js';
import { protect } from '../middlewares/authMiddleware.js'; // Security middleware

const router = express.Router();

router.get('/', protect, getAllMedia);
router.post('/', protect, upload.single('image'), uploadMedia);
router.delete('/:id', protect, deleteMedia);

export default router;
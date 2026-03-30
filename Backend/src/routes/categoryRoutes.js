
import express from 'express';
import { 
    getCategories, createCategory, getCategoryById,updateCategory, deleteCategory 
} from '../controllers/categoryController.js';

import { protect } from '../middlewares/authMiddleware.js'; // Auth protection 

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, createCategory);
router.get('/:id', getCategoryById);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);

export default router;

import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js'; // Optional: For Security

const router = express.Router();

router.post('/register', protect, registerUser); // Only Admin register
router.post('/login', loginUser);

export default router;

import express from 'express';
import { getSettings, updateGeneralSettings, updateProfile } from '../controllers/settingsController.js';
import { protect } from '../middlewares/authMiddleware.js'; // Middleware import

const router = express.Router();

router.get('/', protect, getSettings);
router.put('/general', protect, updateGeneralSettings);
router.put('/profile', protect, updateProfile);

export default router;


import express from 'express';
import { getServerHealth} from '../controllers/serverController.js';
import { protect } from '../middlewares/authMiddleware.js'; // Middleware import

const router = express.Router();

router.get('/', protect, getServerHealth);

export default router;
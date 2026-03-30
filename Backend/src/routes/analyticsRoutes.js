
import express from 'express';
import { getStats, getChartData } from '../controllers/analyticsController.js';
import { protect } from '../middlewares/authMiddleware.js'; // Auth protection 

const router = express.Router();

router.get('/stats',protect, getStats);
router.get('/charts', protect, getChartData);

export default router;
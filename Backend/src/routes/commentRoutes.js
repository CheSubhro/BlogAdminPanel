
import express from 'express';
const router = express.Router();
import { 
    getComments,
    createComment, 
    updateStatus, 
    adminReply, 
    deleteComment, 
    approveAll 
} from '../controllers/commentController.js';
import { protect } from '../middlewares/authMiddleware.js'; // Auth protection

router.post('/',createComment)
router.get('/', protect, getComments);
router.put('/approve-all', protect, approveAll);
router.patch('/:id/status',protect, updateStatus);
router.patch('/:id/reply',protect, adminReply);
router.delete('/:id', protect,deleteComment);

export default router;

import express from 'express';
const router = express.Router();
import { getUsers, inviteUser, updateUser, deleteUser,
         getRoleDistribution,getHeroStats,globalSearch,
         sendUserEmail } from '../controllers/userController.js';

import { protect } from '../middlewares/authMiddleware.js'; // Auth Protection Import

// --- Dashboard & Analytics ---
router.get('/dashboard/hero', protect, getHeroStats);
router.get('/search/all', protect, globalSearch);
router.get('/roles/distribution', protect, getRoleDistribution);

// User Management
router.route('/')
    .get(protect, getUsers)      
    .post(protect, inviteUser);  

router.route('/:id')
    .put(protect, updateUser)    
    .delete(protect, deleteUser); 

router.post('/send-mail',protect, sendUserEmail);    


export default router;
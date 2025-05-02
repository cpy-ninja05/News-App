import { Router } from 'express';
import { registerUser, loginUser, logoutUser, updateUserPreferences } from '../controllers/loginRegisterController.js';
import verifyToken  from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', verifyToken, logoutUser);
router.patch('/preferences', verifyToken, updateUserPreferences);

export default router;

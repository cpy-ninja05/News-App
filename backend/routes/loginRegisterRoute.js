import { Router } from 'express';
import { loginUser, logoutUser, registerUser, updateUserPreferences } from '../controllers/loginRegisterController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', verifyToken, logoutUser);
router.post('/preferences/:email', updateUserPreferences);

export default router;

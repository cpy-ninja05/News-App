import { Router } from 'express';
import { getPreferences, loginUser, logoutUser, registerUser, updateUserPreferences, changePreferences } from '../controllers/loginRegisterController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', verifyToken, logoutUser);
router.post('/preferences/:email', updateUserPreferences);
router.get('/preferences',verifyToken,getPreferences);
router.put('/preferences', verifyToken, changePreferences);

export default router;

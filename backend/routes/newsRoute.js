import { Router } from 'express';
import { categories } from '../controllers/categories.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = Router();

router.get('/categories', verifyToken, categories);

export default router;
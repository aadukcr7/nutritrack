import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /auth/register
 * Register a new user
 * Body: { email, password, full_name?, due_date? }
 */
router.post('/register', register);

/**
 * POST /auth/login
 * Login user and get JWT token
 * Body: { email, password }
 */
router.post('/login', login);

/**
 * GET /auth/me
 * Get current user profile (requires authentication)
 */
router.get('/me', authenticateToken, getCurrentUser);

export default router;

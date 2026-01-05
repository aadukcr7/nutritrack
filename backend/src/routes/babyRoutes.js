import express from 'express';
import * as babyController from '../controllers/babyController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * GET /api/babies
 * Get all babies for the current user
 */
router.get('/', babyController.getBabies);

/**
 * POST /api/babies
 * Create a new baby
 */
router.post('/', babyController.createBaby);

/**
 * GET /api/babies/:babyId
 * Get a specific baby with growth records
 */
router.get('/:babyId', babyController.getBaby);

/**
 * PUT /api/babies/:babyId
 * Update a baby's information
 */
router.put('/:babyId', babyController.updateBaby);

/**
 * DELETE /api/babies/:babyId
 * Delete (deactivate) a baby
 */
router.delete('/:babyId', babyController.deleteBaby);

/**
 * GET /api/babies/:babyId/growth
 * Get growth records for a specific baby (weekly tracking)
 */
router.get('/:babyId/growth', babyController.getBabyGrowthRecords);

export default router;

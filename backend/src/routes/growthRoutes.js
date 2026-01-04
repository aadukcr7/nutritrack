import express from 'express';
import {
  getGrowthRecords,
  createGrowthRecord,
  getGrowthRecord,
  updateGrowthRecord,
  deleteGrowthRecord,
} from '../controllers/growthController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /growth/records
 * Get all growth records for the current user
 */
router.get('/records', authenticateToken, getGrowthRecords);

/**
 * POST /growth/records
 * Create a new growth record
 * Body: { age_months, weight_kg, height_cm, head_circumference_cm }
 */
router.post('/records', authenticateToken, createGrowthRecord);

/**
 * GET /growth/records/:recordId
 * Get a specific growth record
 */
router.get('/records/:recordId', authenticateToken, getGrowthRecord);

/**
 * PUT /growth/records/:recordId
 * Update a growth record
 */
router.put('/records/:recordId', authenticateToken, updateGrowthRecord);

/**
 * DELETE /growth/records/:recordId
 * Delete a growth record
 */
router.delete('/records/:recordId', authenticateToken, deleteGrowthRecord);

export default router;

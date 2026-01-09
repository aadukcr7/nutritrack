import express from 'express';
import { getAllFeedings, getFeedingById, getFeedingsByAge } from '../controllers/feedingController.js';

const router = express.Router();

// GET /api/feedings/ - list all feeding entries
router.get('/', getFeedingsByAge);

// GET /api/feedings/:feedingId - get specific feeding entry
router.get('/:feedingId', getFeedingById);

export default router;

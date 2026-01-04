import express from 'express';
import {
  getNutritionTips,
  getSafeUnsafeFoods,
  getVaccineSchedule,
  getFeedingGuide,
  getDailyTip,
} from '../controllers/staticController.js';

const router = express.Router();

/**
 * GET /static/nutrition-tips
 * Get nutrition tips
 */
router.get('/nutrition-tips', getNutritionTips);

/**
 * GET /static/safe-foods
 * Get safe and unsafe foods
 */
router.get('/safe-foods', getSafeUnsafeFoods);

/**
 * GET /static/vaccine-schedule
 * Get vaccine schedule
 */
router.get('/vaccine-schedule', getVaccineSchedule);

/**
 * GET /static/feeding-guide
 * Get feeding guide
 */
router.get('/feeding-guide', getFeedingGuide);

/**
 * GET /static/daily-tip
 * Get a daily tip
 */
router.get('/daily-tip', getDailyTip);

export default router;

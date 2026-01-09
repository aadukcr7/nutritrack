import express from 'express';
import {
  getAllVaccines,
  getVaccineById,
  getUserVaccineReminders,
  createVaccineReminder,
  updateVaccineReminderStatus,
  deleteVaccineReminder,
  cleanupDuplicateReminders,
} from '../controllers/vaccineController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /vaccines/reminders/user
 * Get all vaccine reminders for the current user
 * Must be BEFORE /:vaccineId to avoid route conflicts
 */
router.get('/reminders/user', authenticateToken, getUserVaccineReminders);

/**
 * POST /vaccines/reminders/cleanup
 * Clean up duplicate vaccine reminders
 */
router.post('/reminders/cleanup', authenticateToken, cleanupDuplicateReminders);

/**
 * POST /vaccines/reminders
 * Create a new vaccine reminder
 * Body: { vaccine_name, reminder_date, dose_number, total_doses, recipient, age_due_months }
 */
router.post('/reminders', authenticateToken, createVaccineReminder);

/**
 * PATCH /vaccines/reminders/:reminderId/status
 * Update vaccine reminder status
 * Body: { status, last_dose_date }
 */
router.patch('/reminders/:reminderId/status', authenticateToken, updateVaccineReminderStatus);

/**
 * DELETE /vaccines/reminders/:reminderId
 * Delete a vaccine reminder
 */
router.delete('/reminders/:reminderId', authenticateToken, deleteVaccineReminder);

/**
 * GET /vaccines
 * Get all available vaccines from database
 */
router.get('/', getAllVaccines);

/**
 * GET /vaccines/:vaccineId
 * Get a specific vaccine by ID
 * Must be LAST to avoid matching other routes
 */
router.get('/:vaccineId', getVaccineById);

export default router;

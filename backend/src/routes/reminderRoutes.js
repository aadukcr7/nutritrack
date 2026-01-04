import express from 'express';
import {
  getReminders,
  createReminder,
  completeReminder,
  deleteReminder,
} from '../controllers/reminderController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /reminders
 * Get all reminders for the current user
 */
router.get('/', authenticateToken, getReminders);

/**
 * POST /reminders
 * Create a new reminder
 * Body: { title, reminder_date, type }
 */
router.post('/', authenticateToken, createReminder);

/**
 * PATCH /reminders/:reminderId/complete
 * Mark a reminder as completed
 */
router.patch('/:reminderId/complete', authenticateToken, completeReminder);

/**
 * DELETE /reminders/:reminderId
 * Delete a reminder
 */
router.delete('/:reminderId', authenticateToken, deleteReminder);

export default router;

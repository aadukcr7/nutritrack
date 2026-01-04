import { Reminder } from '../models/index.js';

/**
 * Get all reminders for the current user
 */
export const getReminders = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const reminders = await Reminder.findAll({
      where: { user_id: userId },
      order: [['reminder_date', 'ASC']],
    });

    return res.json(reminders);
  } catch (error) {
    console.error(`Error fetching reminders: ${error.message}`);
    return res.status(500).json({ detail: 'Error fetching reminders' });
  }
};

/**
 * Create a new reminder
 */
export const createReminder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, reminder_date, type } = req.body;

    const newReminder = await Reminder.create({
      user_id: userId,
      title,
      reminder_date,
      type,
    });

    return res.status(201).json(newReminder);
  } catch (error) {
    console.error(`Error creating reminder: ${error.message}`);
    return res.status(500).json({ detail: 'Error creating reminder' });
  }
};

/**
 * Mark a reminder as completed
 */
export const completeReminder = async (req, res, next) => {
  try {
    const { reminderId } = req.params;
    const userId = req.user.id;

    const reminder = await Reminder.findOne({
      where: { id: reminderId, user_id: userId },
    });

    if (!reminder) {
      return res.status(404).json({ detail: 'Reminder not found' });
    }

    await reminder.update({ completed: true });
    return res.json(reminder);
  } catch (error) {
    console.error(`Error completing reminder: ${error.message}`);
    return res.status(500).json({ detail: 'Error completing reminder' });
  }
};

/**
 * Delete a reminder
 */
export const deleteReminder = async (req, res, next) => {
  try {
    const { reminderId } = req.params;
    const userId = req.user.id;

    const reminder = await Reminder.findOne({
      where: { id: reminderId, user_id: userId },
    });

    if (!reminder) {
      return res.status(404).json({ detail: 'Reminder not found' });
    }

    await reminder.destroy();
    return res.json({ msg: 'Reminder deleted' });
  } catch (error) {
    console.error(`Error deleting reminder: ${error.message}`);
    return res.status(500).json({ detail: 'Error deleting reminder' });
  }
};

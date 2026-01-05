import { GrowthRecord } from '../models/index.js';

/**
 * Get all growth records for the current user
 */
export const getGrowthRecords = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const records = await GrowthRecord.findAll({
      where: { user_id: userId },
      order: [['date', 'DESC']],
    });

    return res.json(records);
  } catch (error) {
    console.error(`Error fetching growth records: ${error.message}`);
    return res.status(500).json({ detail: 'Error fetching growth records' });
  }
};

/**
 * Create a new growth record
 */
export const createGrowthRecord = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { baby_id, age_months, weight_kg, height_cm, head_circumference_cm } = req.body;

    const newRecord = await GrowthRecord.create({
      user_id: userId,
      baby_id,
      age_months,
      weight_kg,
      height_cm,
      head_circumference_cm,
    });

    return res.status(201).json(newRecord);
  } catch (error) {
    console.error(`Error creating growth record: ${error.message}`);
    return res.status(500).json({ detail: 'Error creating growth record' });
  }
};

/**
 * Get a specific growth record
 */
export const getGrowthRecord = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const userId = req.user.id;

    const record = await GrowthRecord.findOne({
      where: { id: recordId, user_id: userId },
    });

    if (!record) {
      return res.status(404).json({ detail: 'Record not found' });
    }

    return res.json(record);
  } catch (error) {
    console.error(`Error fetching growth record: ${error.message}`);
    return res.status(500).json({ detail: 'Error fetching growth record' });
  }
};

/**
 * Update a growth record
 */
export const updateGrowthRecord = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const userId = req.user.id;
    const { baby_id, age_months, weight_kg, height_cm, head_circumference_cm } = req.body;

    const record = await GrowthRecord.findOne({
      where: { id: recordId, user_id: userId },
    });

    if (!record) {
      return res.status(404).json({ detail: 'Record not found' });
    }

    await record.update({
      baby_id,
      age_months,
      weight_kg,
      height_cm,
      head_circumference_cm,
    });

    return res.json(record);
  } catch (error) {
    console.error(`Error updating growth record: ${error.message}`);
    return res.status(500).json({ detail: 'Error updating growth record' });
  }
};

/**
 * Delete a growth record
 */
export const deleteGrowthRecord = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const userId = req.user.id;

    const record = await GrowthRecord.findOne({
      where: { id: recordId, user_id: userId },
    });

    if (!record) {
      return res.status(404).json({ detail: 'Record not found' });
    }

    await record.destroy();
    return res.json({ msg: 'Record deleted' });
  } catch (error) {
    console.error(`Error deleting growth record: ${error.message}`);
    return res.status(500).json({ detail: 'Error deleting growth record' });
  }
};

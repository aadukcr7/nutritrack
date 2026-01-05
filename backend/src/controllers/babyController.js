import { Baby, GrowthRecord } from '../models/index.js';

/**
 * Get all babies for the current user
 */
export const getBabies = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const babies = await Baby.findAll({
      where: { user_id: userId, is_active: true },
      order: [['created_at', 'DESC']],
    });

    return res.json(babies);
  } catch (error) {
    console.error(`Error fetching babies: ${error.message}`);
    return res.status(500).json({ detail: 'Error fetching babies' });
  }
};

/**
 * Get a specific baby with growth records
 */
export const getBaby = async (req, res, next) => {
  try {
    const { babyId } = req.params;
    const userId = req.user.id;

    const baby = await Baby.findOne({
      where: { id: babyId, user_id: userId, is_active: true },
      include: [{
        model: GrowthRecord,
        order: [['date', 'DESC']],
      }],
    });

    if (!baby) {
      return res.status(404).json({ detail: 'Baby not found' });
    }

    return res.json(baby);
  } catch (error) {
    console.error(`Error fetching baby: ${error.message}`);
    return res.status(500).json({ detail: 'Error fetching baby' });
  }
};

/**
 * Create a new baby
 */
export const createBaby = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      name,
      date_of_birth,
      gender,
      weight_at_birth_kg,
      height_at_birth_cm,
      head_circumference_at_birth_cm,
      blood_type,
      allergies,
      notes,
    } = req.body;

    // Validate required fields
    if (!name || !date_of_birth) {
      return res.status(400).json({ detail: 'Name and date of birth are required' });
    }

    const newBaby = await Baby.create({
      user_id: userId,
      name,
      date_of_birth: new Date(date_of_birth),
      gender,
      weight_at_birth_kg,
      height_at_birth_cm,
      head_circumference_at_birth_cm,
      blood_type,
      allergies,
      notes,
      is_active: true,
    });

    return res.status(201).json(newBaby);
  } catch (error) {
    console.error(`Error creating baby: ${error.message}`);
    return res.status(500).json({ detail: 'Error creating baby' });
  }
};

/**
 * Update a baby's information
 */
export const updateBaby = async (req, res, next) => {
  try {
    const { babyId } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    const baby = await Baby.findOne({
      where: { id: babyId, user_id: userId, is_active: true },
    });

    if (!baby) {
      return res.status(404).json({ detail: 'Baby not found' });
    }

    // Update the baby record
    await baby.update(updateData);

    return res.json(baby);
  } catch (error) {
    console.error(`Error updating baby: ${error.message}`);
    return res.status(500).json({ detail: 'Error updating baby' });
  }
};

/**
 * Delete (deactivate) a baby
 */
export const deleteBaby = async (req, res, next) => {
  try {
    const { babyId } = req.params;
    const userId = req.user.id;

    const baby = await Baby.findOne({
      where: { id: babyId, user_id: userId, is_active: true },
    });

    if (!baby) {
      return res.status(404).json({ detail: 'Baby not found' });
    }

    // Soft delete - mark as inactive
    await baby.update({ is_active: false });

    return res.status(204).end();
  } catch (error) {
    console.error(`Error deleting baby: ${error.message}`);
    return res.status(500).json({ detail: 'Error deleting baby' });
  }
};

/**
 * Get growth records for a specific baby (weekly tracking)
 */
export const getBabyGrowthRecords = async (req, res, next) => {
  try {
    const { babyId } = req.params;
    const userId = req.user.id;

    // Verify baby belongs to user
    const baby = await Baby.findOne({
      where: { id: babyId, user_id: userId, is_active: true },
    });

    if (!baby) {
      return res.status(404).json({ detail: 'Baby not found' });
    }

    const growthRecords = await GrowthRecord.findAll({
      where: { baby_id: babyId },
      order: [['date', 'DESC']],
    });

    return res.json({
      baby,
      growth_records: growthRecords,
      total_records: growthRecords.length,
    });
  } catch (error) {
    console.error(`Error fetching baby growth records: ${error.message}`);
    return res.status(500).json({ detail: 'Error fetching growth records' });
  }
};

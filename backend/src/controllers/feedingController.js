import { Feeding } from '../models/index.js';

export const getAllFeedings = async (req, res, next) => {
  try {
    const feedings = await Feeding.findAll({ order: [['age_months_min', 'ASC'], ['title', 'ASC']] });
    return res.json(feedings);
  } catch (error) {
    console.error(`Error fetching feedings: ${error.message}`);
    return res.status(500).json({ detail: 'Error fetching feedings' });
  }
};

export const getFeedingById = async (req, res, next) => {
  try {
    const { feedingId } = req.params;
    const feeding = await Feeding.findByPk(feedingId);
    if (!feeding) return res.status(404).json({ detail: 'Feeding entry not found' });
    return res.json(feeding);
  } catch (error) {
    console.error(`Error fetching feeding: ${error.message}`);
    return res.status(500).json({ detail: 'Error fetching feeding' });
  }
};

// Optional: filter by age in months via query ?age=5
export const getFeedingsByAge = async (req, res, next) => {
  try {
    const age = parseInt(req.query.age, 10);
    if (Number.isNaN(age)) return getAllFeedings(req, res, next);

    const feedings = await Feeding.findAll({
      where: {
        age_months_min: { [Feeding.sequelize.Op.lte]: age },
        age_months_max: { [Feeding.sequelize.Op.gte]: age },
      },
      order: [['age_months_min', 'ASC']]
    });

    return res.json(feedings);
  } catch (error) {
    console.error(`Error filtering feedings by age: ${error.message}`);
    return res.status(500).json({ detail: 'Error filtering feedings' });
  }
};

import sequelize from '../db/sequelize.js';
import { Feeding } from '../models/index.js';

const feedings = [
  {
    title: 'Breastfeeding (typical)',
    emoji: '🤱',
    age_group: '0-6 months',
    age_months_min: 0,
    age_months_max: 6,
    type: 'Breastfeeding',
    frequency: 'On demand, 8–12 times/day',
    amount: 'Feeds until satisfied; expect 10–20 min per breast',
    notes: 'Responsive feeding; watch hunger cues like rooting and sucking. Cluster feeding in evenings is common.',
    tips: 'Ensure proper latch; seek lactation support if pain or low supply.'
  },
  {
    title: 'Formula feeding (typical)',
    emoji: '🍼',
    age_group: '0-6 months',
    age_months_min: 0,
    age_months_max: 6,
    type: 'Formula',
    frequency: 'Every 3–4 hours',
    amount: '4–6 oz per feeding (total ~24–32 oz/day)',
    notes: 'Hold and pace bottle-feeding to avoid overfeeding. Burp between feeds.',
    tips: 'Use formula according to preparation instructions; discard leftover formula after a feed.'
  },
  {
    title: 'Night feeds',
    emoji: '🌙',
    age_group: '0-6 months',
    age_months_min: 0,
    age_months_max: 6,
    type: 'Night',
    frequency: 'May be 0–3 times/night depending on age and weight',
    amount: 'Small feeds as needed (breast or 2–4 oz formula)',
    notes: 'Try soothing between feeds to encourage longer sleep stretches if weight gain is good.',
    tips: 'Discuss with provider if frequent night waking is accompanied by poor weight gain.'
  },
  {
    title: 'Starting Solids (approx 6 months)',
    emoji: '🍽️',
    age_group: '6+ months',
    age_months_min: 6,
    age_months_max: 12,
    type: 'Solids',
    frequency: 'Begin with once daily, increase to 2–3 times/day',
    amount: '1–2 tbsp to start, slowly increase',
    notes: 'Start with single-ingredient purees or soft mashed foods. Solids complement but do not replace milk initially.',
    tips: 'Introduce one new food every few days to watch for reactions.'
  }
];

export const seedFeedings = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false, alter: false });

    const existing = await Feeding.count();
    if (existing > 0) {
      console.log(`${existing} feeding entries already exist. Skipping feeding seed.`);
      return;
    }

    await Feeding.bulkCreate(feedings);
    console.log(`✓ Successfully seeded ${feedings.length} feeding entries`);
  } catch (error) {
    console.error('Error seeding feedings:', error);
    throw error;
  }
};

// Allow running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedFeedings().then(() => process.exit(0)).catch(() => process.exit(1));
}

export default seedFeedings;

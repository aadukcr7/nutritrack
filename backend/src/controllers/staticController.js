/**
 * Get nutrition tips
 */
export const getNutritionTips = (req, res) => {
  const tips = {
    tips: [
      'Eat plenty of fruits and vegetables',
      'Include iron-rich foods like lean meat and beans',
      'Take prenatal vitamins with folic acid',
      'Stay hydrated - drink plenty of water',
      'Eat calcium-rich foods for bone health',
    ],
  };
  return res.json(tips);
};

/**
 * Get safe and unsafe foods
 */
export const getSafeUnsafeFoods = (req, res) => {
  const foods = {
    safe: [
      'Pasteurized dairy',
      'Cooked meats',
      'Washed fruits and vegetables',
      'Eggs (fully cooked)',
      'Beans and legumes',
    ],
    unsafe: [
      'Raw fish',
      'Unpasteurized cheese',
      'Deli meats (unless heated)',
      'Alcohol',
      'Raw or undercooked eggs',
    ],
  };
  return res.json(foods);
};

/**
 * Get vaccine schedule
 */
export const getVaccineSchedule = (req, res) => {
  const schedule = {
    schedule: [
      {
        vaccine: 'Tdap (Tetanus, Diphtheria, Pertussis)',
        timing: '27–36 weeks of pregnancy (preferably early in this window)',
        note: 'Recommended during every pregnancy to protect baby from whooping cough',
      },
      {
        vaccine: 'Influenza (Flu shot - inactivated)',
        timing: 'Any trimester (ideally before or during flu season)',
        note: 'Safe and recommended; get every year',
      },
      {
        vaccine: 'COVID-19 (updated 2025-2026 formulation)',
        timing: 'Any trimester',
        note: 'Strongly recommended; protects mom and passes antibodies to baby',
      },
      {
        vaccine: 'RSV (Abrysvo by Pfizer only)',
        timing: '32–36 weeks of pregnancy (September–January in most areas)',
        note: 'Seasonal; protects baby from severe RSV in first 6 months',
      },
    ],
    source: 'Based on CDC and ACOG guidelines (2025)',
    disclaimer: 'Always consult your healthcare provider for personalized advice',
  };
  return res.json(schedule);
};

/**
 * Get feeding guide
 */
export const getFeedingGuide = (req, res) => {
  const guide = {
    by_age: {
      '0-6 months': 'Exclusive breast milk or formula',
      '6-8 months': 'Introduce purees, 2-3 meals',
      '9-12 months': 'Finger foods, 3 meals + snacks',
    },
  };
  return res.json(guide);
};

/**
 * Get daily tip
 */
export const getDailyTip = (req, res) => {
  const tips = [
    'Stay hydrated - drink plenty of water',
    'Walk daily for light exercise',
    'Rest when needed - listen to your body',
    'Eat nutrient-rich meals',
    'Keep track of your symptoms',
  ];
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  return res.json({ tip: randomTip });
};

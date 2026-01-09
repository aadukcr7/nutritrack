/**
 * Vaccine Schedule Configuration
 * Defines the recommended timing between doses for each vaccine
 */

export const vaccineScheduleConfig = {
  'BCG (Bacillus Calmette Guerin)': {
    totalDoses: 1,
    spacing: [
      { dose: 1, ageMonths: 0, note: 'At birth' }
    ]
  },
  'Pentavalent Vaccine (Diphtheria, Pertussis, Tetanus, Hepatitis B and Hemophilus influenza B)': {
    totalDoses: 3,
    spacing: [
      { dose: 1, ageMonths: 1.5, note: '6 weeks' },
      { dose: 2, ageMonths: 2.5, note: '10 weeks' },
      { dose: 3, ageMonths: 4, note: '14 weeks' }
    ]
  },
  'OPV (Oral Polio Vaccine)': {
    totalDoses: 3,
    spacing: [
      { dose: 1, ageMonths: 1.5, note: '6 weeks' },
      { dose: 2, ageMonths: 2.5, note: '10 weeks' },
      { dose: 3, ageMonths: 4, note: '14 weeks' }
    ]
  },
  'PCV (Pneumococcal Conjugate Vaccine)': {
    totalDoses: 3,
    spacing: [
      { dose: 1, ageMonths: 1.5, note: '6 weeks' },
      { dose: 2, ageMonths: 2.5, note: '10 weeks' },
      { dose: 3, ageMonths: 9, note: '9 months' }
    ]
  },
  'Rotavirus Vaccine': {
    totalDoses: 2,
    spacing: [
      { dose: 1, ageMonths: 1.5, note: '6 weeks' },
      { dose: 2, ageMonths: 4, note: '10 weeks' }
    ]
  },
  'fIPV (Fractional Injectable Polio Vaccine)': {
    totalDoses: 2,
    spacing: [
      { dose: 1, ageMonths: 1.5, note: '6 weeks' },
      { dose: 2, ageMonths: 3.5, note: '14 weeks' }
    ]
  },
  'MR (Measles - Rubella)': {
    totalDoses: 2,
    spacing: [
      { dose: 1, ageMonths: 9, note: '9 months' },
      { dose: 2, ageMonths: 15, note: '15 months' }
    ]
  },
  'JE (Japanese Encephalitis)': {
    totalDoses: 1,
    spacing: [
      { dose: 1, ageMonths: 12, note: '12 months' }
    ]
  },
  'Typhoid Vaccine': {
    totalDoses: 1,
    spacing: [
      { dose: 1, ageMonths: 15, note: '15 months' }
    ]
  },
  'Hepatitis A Vaccine': {
    totalDoses: 2,
    spacing: [
      { dose: 1, ageMonths: 12, note: 'After 1 year' },
      { dose: 2, ageMonths: 18, note: '6 months after first dose' }
    ]
  },
  'Varicella (Chickenpox) Vaccine': {
    totalDoses: 2,
    spacing: [
      { dose: 1, ageMonths: 12, note: 'After 12 months' },
      { dose: 2, ageMonths: 15, note: '15 months booster' }
    ]
  },
  'Influenza (Flu) Vaccine': {
    totalDoses: 1,
    spacing: [
      { dose: 1, ageMonths: 6, note: 'After 6 months (annual)' }
    ]
  },
  'HPV (Human Papillomavirus) Vaccine': {
    totalDoses: 2,
    spacing: [
      { dose: 1, ageMonths: 120, note: '9-14 years' },
      { dose: 2, ageMonths: 126, note: '6 months after first dose' }
    ]
  },
  'Meningococcal Vaccine': {
    totalDoses: 1,
    spacing: [
      { dose: 1, ageMonths: 9, note: '9 months or as advised' }
    ]
  },
  'Rabies (Pre-exposure) Vaccine': {
    totalDoses: 3,
    spacing: [
      { dose: 1, ageMonths: 0, note: 'Day 0 (pre-exposure)' },
      { dose: 2, ageMonths: 1, note: '1 month after first dose' },
      { dose: 3, ageMonths: 2, note: '2 months after first dose' }
    ]
  }
};

/**
 * Calculate next dose date based on vaccine schedule
 * Returns date as YYYY-MM-DD string
 */
export const getNextDoseDate = (vaccineName, currentDoseNumber, lastDoseDateString) => {
  const schedule = vaccineScheduleConfig[vaccineName];
  
  if (!schedule || currentDoseNumber >= schedule.totalDoses) {
    return null; // No more doses
  }

  const nextDoseInfo = schedule.spacing.find(s => s.dose === currentDoseNumber + 1);
  if (!nextDoseInfo) return null;

  // Parse the date string (YYYY-MM-DD format)
  const [year, month, day] = lastDoseDateString.split('-').map(Number);
  const lastDoseDate = new Date(year, month - 1, day);
  
  const nextDate = new Date(lastDoseDate);
  const weeksToAdd = nextDoseInfo.ageMonths * 4.33; // Convert months to weeks
  nextDate.setDate(nextDate.getDate() + (weeksToAdd * 7));
  
  // Return as YYYY-MM-DD string
  return `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;
};

/**
 * Check if vaccine is due within specified days
 */
export const isVaccineDueWithin = (dueDate, days = 7) => {
  const today = new Date();
  const due = new Date(dueDate);
  const daysRemaining = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  return daysRemaining > 0 && daysRemaining <= days;
};

/**
 * Parse date string correctly without timezone shift
 * Handles both "YYYY-MM-DD" and ISO formats
 */
function parseDateString(dateString) {
  if (!dateString) return null;
  
  // If it's an ISO string with time component, extract just the date part
  let dateOnly = dateString;
  if (dateString.includes('T')) {
    dateOnly = dateString.split('T')[0]; // Get "2026-01-05" from "2026-01-05T00:00:00Z"
  }
  
  // Parse YYYY-MM-DD format without timezone conversion
  const [year, month, day] = dateOnly.split('-').map(Number);
  return new Date(year, month - 1, day); // month - 1 because JS months are 0-indexed
}

/**
 * Calculate vaccine reminder date from baby's birth date and vaccine schedule
 * @param {string} birthDateString - Baby's birth date (ISO string or date)
 * @param {number} ageMonths - Age in months when vaccine should be given
 * @returns {Date} The date when vaccine should be administered
 */
export const calculateVaccineDateFromBirth = (birthDateString, ageMonths) => {
  if (!birthDateString) return null;
  
  const birthDate = parseDateString(birthDateString);
  if (!birthDate || Number.isNaN(birthDate.getTime())) return null;

  // Create a new date from the birth date components
  const reminderDate = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  
  // If 0 months (at birth), return the birth date exactly
  if (ageMonths === 0) {
    return reminderDate;
  }
  
  // Add months
  const monthsToAdd = Math.floor(ageMonths);
  reminderDate.setMonth(reminderDate.getMonth() + monthsToAdd);
  
  // Add remaining days (fractional months converted to days)
  const remainingMonths = ageMonths % 1;
  if (remainingMonths > 0) {
    const daysToAdd = Math.round(remainingMonths * 30.44); // Average days per month
    reminderDate.setDate(reminderDate.getDate() + daysToAdd);
  }
  
  return reminderDate;
};

/**
 * Generate all vaccine reminder data from baby's birth date
 * Creates reminder objects for all doses of all vaccines
 * @param {Array} allVaccines - All vaccine master records
 * @param {string} birthDateString - Baby's birth date
 * @param {string} userType - 'baby' or 'mother' to filter vaccines
 * @returns {Array} Array of reminder objects ready to create
 */
export const generateAutomaticVaccineReminders = (allVaccines, birthDateString, userType = 'baby') => {
  if (!birthDateString) return [];

  const reminders = [];

  allVaccines.forEach(vaccine => {
    // Filter by recipient type
    if (vaccine.recipient_type !== userType && vaccine.recipient_type !== 'both') {
      return;
    }

    const schedule = vaccineScheduleConfig[vaccine.name];
    if (!schedule) return;

    // Create reminder for each dose
    schedule.spacing.forEach(doseTiming => {
      const reminderDate = calculateVaccineDateFromBirth(birthDateString, doseTiming.ageMonths);
      
      if (reminderDate) {
        // Convert Date to YYYY-MM-DD string (no timezone shift)
        const dateString = `${reminderDate.getFullYear()}-${String(reminderDate.getMonth() + 1).padStart(2, '0')}-${String(reminderDate.getDate()).padStart(2, '0')}`;
        
        reminders.push({
          vaccine_name: vaccine.name,
          reminder_date: dateString,
          dose_number: doseTiming.dose,
          total_doses: vaccine.total_doses,
          recipient: userType,
          age_due_months: doseTiming.ageMonths,
          description: vaccine.description,
          vaccine_icon: vaccine.emoji,
          status: 'pending',
          note: doseTiming.note,
        });
      }
    });
  });

  return reminders;
};

export default vaccineScheduleConfig;

/**
 * VACCINE MODEL
 * =============
 * Defines the Vaccine schema for the database
 * Stores vaccine information including name, description, doses, and recommendation status
 */

import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';

const Vaccine = sequelize.define('Vaccine', {
  // Primary key - Auto-incrementing ID
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  // Vaccine name (required)
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  
  // Emoji icon for display (default: 💉)
  emoji: {
    type: DataTypes.STRING(10),
    defaultValue: '💉',
  },
  
  // Detailed description of what the vaccine prevents
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  // Total number of doses required for full immunization
  total_doses: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  
  // Who should receive this vaccine: baby, mother, or both
  recipient_type: {
    type: DataTypes.ENUM('baby', 'mother', 'both'),
    defaultValue: 'both',
  },
  
  // Whether this vaccine is recommended (based on health guidelines)
  // Recommended vaccines: Influenza, Meningitis, Typhoid, Varicella, Hepatitis A, HPV
  recommended: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
}, {
  tableName: 'vaccines',
  timestamps: false,
});

export default Vaccine;

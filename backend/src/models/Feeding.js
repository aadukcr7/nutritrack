import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';

const Feeding = sequelize.define('Feeding', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  emoji: {
    type: DataTypes.STRING(8),
    defaultValue: '🍼',
  },
  age_group: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  age_months_min: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  age_months_max: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  frequency: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  amount: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tips: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'feedings',
  timestamps: false,
});

export default Feeding;

import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';
import User from './User.js';

const GrowthRecord = sequelize.define('GrowthRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  age_months: {
    type: DataTypes.INTEGER,
  },
  weight_kg: {
    type: DataTypes.FLOAT,
  },
  height_cm: {
    type: DataTypes.FLOAT,
  },
  head_circumference_cm: {
    type: DataTypes.FLOAT,
  },
}, {
  tableName: 'growth_records',
  timestamps: false,
});

GrowthRecord.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(GrowthRecord, { foreignKey: 'user_id' });

export default GrowthRecord;

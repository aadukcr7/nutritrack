import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';
import User from './User.js';
import Baby from './Baby.js';

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
  baby_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Baby,
      key: 'id',
    },
    allowNull: true,
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
GrowthRecord.belongsTo(Baby, { foreignKey: 'baby_id' });
User.hasMany(GrowthRecord, { foreignKey: 'user_id' });
Baby.hasMany(GrowthRecord, { foreignKey: 'baby_id' });

export default GrowthRecord;

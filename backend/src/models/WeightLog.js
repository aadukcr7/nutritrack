import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';
import User from './User.js';

const WeightLog = sequelize.define('WeightLog', {
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
  weight_kg: {
    type: DataTypes.FLOAT,
  },
  logged_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'weight_logs',
  timestamps: false,
});

WeightLog.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(WeightLog, { foreignKey: 'user_id' });

export default WeightLog;

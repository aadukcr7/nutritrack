import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';
import User from './User.js';

const WaterIntake = sequelize.define('WaterIntake', {
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
  amount_ml: {
    type: DataTypes.INTEGER,
  },
  logged_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'water_intake',
  timestamps: false,
});

WaterIntake.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(WaterIntake, { foreignKey: 'user_id' });

export default WaterIntake;

import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';
import User from './User.js';

const NutritionGoal = sequelize.define('NutritionGoal', {
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
  daily_calories: {
    type: DataTypes.INTEGER,
  },
  daily_protein_g: {
    type: DataTypes.FLOAT,
  },
  daily_carbs_g: {
    type: DataTypes.FLOAT,
  },
  daily_fat_g: {
    type: DataTypes.FLOAT,
  },
  daily_water_ml: {
    type: DataTypes.INTEGER,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'nutrition_goals',
  timestamps: false,
});

NutritionGoal.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(NutritionGoal, { foreignKey: 'user_id' });

export default NutritionGoal;

import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';
import User from './User.js';

const Meal = sequelize.define('Meal', {
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
  meal_type: {
    type: DataTypes.STRING(50), // 'breakfast', 'lunch', 'dinner', 'snack'
  },
  food_name: {
    type: DataTypes.STRING(255),
  },
  portion_size: {
    type: DataTypes.STRING(100),
  },
  calories: {
    type: DataTypes.FLOAT,
  },
  protein_g: {
    type: DataTypes.FLOAT,
  },
  carbs_g: {
    type: DataTypes.FLOAT,
  },
  fat_g: {
    type: DataTypes.FLOAT,
  },
  meal_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'meals',
  timestamps: false,
});

Meal.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Meal, { foreignKey: 'user_id' });

export default Meal;

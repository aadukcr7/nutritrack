import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';
import User from './User.js';

const Symptom = sequelize.define('Symptom', {
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
  symptom_name: {
    type: DataTypes.STRING(255),
  },
  severity: {
    type: DataTypes.STRING(50), // 'mild', 'moderate', 'severe'
  },
  logged_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'symptoms',
  timestamps: false,
});

Symptom.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Symptom, { foreignKey: 'user_id' });

export default Symptom;

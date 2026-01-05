import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';
import User from './User.js';

const Baby = sequelize.define('Baby', {
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
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  date_of_birth: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true,
  },
  weight_at_birth_kg: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  height_at_birth_cm: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  head_circumference_at_birth_cm: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  blood_type: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  allergies: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'babies',
  timestamps: false,
});

Baby.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Baby, { foreignKey: 'user_id' });

export default Baby;

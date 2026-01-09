import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
  },
  hashed_password: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  full_name: {
    type: DataTypes.STRING(255),
  },
  due_date: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  user_type: {
    type: DataTypes.ENUM('pregnant', 'newParent', 'trying'),
    allowNull: true,
  },
  baby_date_of_birth: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  provider: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  provider_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  picture_url: {
    type: DataTypes.STRING(512),
    allowNull: true,
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
  tableName: 'users',
  timestamps: false,
});

export default User;

import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';
import User from './User.js';

const Reminder = sequelize.define('Reminder', {
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
  title: {
    type: DataTypes.STRING(255),
  },
  reminder_date: {
    type: DataTypes.DATE,
  },
  type: {
    type: DataTypes.STRING(50), // 'vaccine' or 'appointment'
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  vaccine_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  dose_number: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  recipient: {
    type: DataTypes.ENUM('baby', 'mother'),
    defaultValue: 'baby',
  },
  age_due_months: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'overdue', 'skipped'),
    defaultValue: 'pending',
  },
}, {
  tableName: 'reminders',
  timestamps: false,
});

Reminder.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Reminder, { foreignKey: 'user_id' });

export default Reminder;

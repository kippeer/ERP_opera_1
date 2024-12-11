const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./Customer');

const SupportTicket = sequelize.define('SupportTicket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'waiting_customer', 'resolved', 'closed'),
    defaultValue: 'open'
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  assigned_to: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resolution: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true
});

SupportTicket.belongsTo(Customer, { foreignKey: 'customer_id' });
Customer.hasMany(SupportTicket, { foreignKey: 'customer_id' });

module.exports = SupportTicket;
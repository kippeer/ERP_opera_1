const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lead = sequelize.define('Lead', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('new', 'qualified', 'converted', 'lost'),
    defaultValue: 'new'
  },
  source: {
    type: DataTypes.STRING,
    allowNull: true
  },
  assigned_to: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true
});

module.exports = Lead;
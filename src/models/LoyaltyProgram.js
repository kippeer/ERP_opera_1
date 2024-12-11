const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LoyaltyProgram = sequelize.define('LoyaltyProgram', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  points_per_currency: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 1.0
  },
  minimum_points_redemption: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100
  },
  points_to_currency_ratio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.01
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  expiration_months: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true
});

module.exports = LoyaltyProgram;
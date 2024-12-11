const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MarketingCampaign = sequelize.define('MarketingCampaign', {
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
  type: {
    type: DataTypes.ENUM('email', 'social_media', 'event', 'advertisement'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'scheduled', 'active', 'completed', 'cancelled'),
    defaultValue: 'draft'
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  target_audience: {
    type: DataTypes.JSON,
    allowNull: true
  },
  success_metrics: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true
});

module.exports = MarketingCampaign;
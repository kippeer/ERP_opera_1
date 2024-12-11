const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const MarketingCampaign = require('./MarketingCampaign');

const CampaignMetric = sequelize.define('CampaignMetric', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  campaign_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: MarketingCampaign,
      key: 'id'
    }
  },
  metric_type: {
    type: DataTypes.ENUM('opens', 'clicks', 'conversions', 'revenue', 'engagement'),
    allowNull: false
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: true,
  underscored: true
});

CampaignMetric.belongsTo(MarketingCampaign, { foreignKey: 'campaign_id' });
MarketingCampaign.hasMany(CampaignMetric, { foreignKey: 'campaign_id' });

module.exports = CampaignMetric;
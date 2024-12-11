const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const MarketingCampaign = require('./MarketingCampaign');
const Lead = require('./Lead');

const CampaignLead = sequelize.define('CampaignLead', {
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
  lead_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Lead,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'contacted', 'responded', 'converted', 'rejected'),
    defaultValue: 'pending'
  },
  interaction_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  last_interaction_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true
});

CampaignLead.belongsTo(MarketingCampaign, { foreignKey: 'campaign_id' });
CampaignLead.belongsTo(Lead, { foreignKey: 'lead_id' });
MarketingCampaign.hasMany(CampaignLead, { foreignKey: 'campaign_id' });
Lead.hasMany(CampaignLead, { foreignKey: 'lead_id' });

module.exports = CampaignLead;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./Customer');

const SalesOpportunity = sequelize.define('SalesOpportunity', {
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
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  stage: {
    type: DataTypes.ENUM('new', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'),
    defaultValue: 'new'
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  probability: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  assigned_to: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  expected_close_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true
});

SalesOpportunity.belongsTo(Customer, { foreignKey: 'customer_id' });
Customer.hasMany(SalesOpportunity, { foreignKey: 'customer_id' });

module.exports = SalesOpportunity;
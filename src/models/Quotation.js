const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./Customer');
const SalesOpportunity = require('./SalesOpportunity');

const Quotation = sequelize.define('Quotation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quote_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: 'id'
    }
  },
  opportunity_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: SalesOpportunity,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('draft', 'sent', 'accepted', 'rejected', 'expired'),
    defaultValue: 'draft'
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  valid_until: {
    type: DataTypes.DATE,
    allowNull: false
  },
  terms_conditions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true,
  underscored: true
});

Quotation.belongsTo(Customer, { foreignKey: 'customer_id' });
Quotation.belongsTo(SalesOpportunity, { foreignKey: 'opportunity_id' });
Customer.hasMany(Quotation, { foreignKey: 'customer_id' });
SalesOpportunity.hasMany(Quotation, { foreignKey: 'opportunity_id' });

module.exports = Quotation;
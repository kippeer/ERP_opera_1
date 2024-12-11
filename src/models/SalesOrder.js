const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./Customer');
const SalesOpportunity = require('./SalesOpportunity');

const SalesOrder = sequelize.define('SalesOrder', {
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
  opportunity_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: SalesOpportunity,
      key: 'id'
    }
  },
  order_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  total_value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'confirmed', 'paid', 'cancelled'),
    defaultValue: 'draft'
  },
  payment_terms: {
    type: DataTypes.STRING,
    allowNull: true
  },
  delivery_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true
});

SalesOrder.belongsTo(Customer, { foreignKey: 'customer_id' });
SalesOrder.belongsTo(SalesOpportunity, { foreignKey: 'opportunity_id' });
Customer.hasMany(SalesOrder, { foreignKey: 'customer_id' });
SalesOpportunity.hasMany(SalesOrder, { foreignKey: 'opportunity_id' });

module.exports = SalesOrder;
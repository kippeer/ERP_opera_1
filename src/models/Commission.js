const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const SalesOrder = require('./SalesOrder');

const Commission = sequelize.define('Commission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sales_order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: SalesOrder,
      key: 'id'
    }
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  commission_rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  commission_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'paid', 'cancelled'),
    defaultValue: 'pending'
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true
});

Commission.belongsTo(SalesOrder, { foreignKey: 'sales_order_id' });
SalesOrder.hasOne(Commission, { foreignKey: 'sales_order_id' });

module.exports = Commission;
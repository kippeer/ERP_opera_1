const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const CustomerLoyalty = require('./CustomerLoyalty');
const SalesOrder = require('./SalesOrder');

const LoyaltyTransaction = sequelize.define('LoyaltyTransaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_loyalty_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: CustomerLoyalty,
      key: 'id'
    }
  },
  transaction_type: {
    type: DataTypes.ENUM('earn', 'redeem', 'expire', 'adjust'),
    allowNull: false
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  reference_type: {
    type: DataTypes.ENUM('order', 'manual', 'system'),
    allowNull: false
  },
  reference_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  expiration_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true
});

LoyaltyTransaction.belongsTo(CustomerLoyalty, { foreignKey: 'customer_loyalty_id' });
CustomerLoyalty.hasMany(LoyaltyTransaction, { foreignKey: 'customer_loyalty_id' });

module.exports = LoyaltyTransaction;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./Customer');
const LoyaltyProgram = require('./LoyaltyProgram');

const CustomerLoyalty = sequelize.define('CustomerLoyalty', {
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
  program_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: LoyaltyProgram,
      key: 'id'
    }
  },
  total_points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  tier_level: {
    type: DataTypes.ENUM('bronze', 'silver', 'gold', 'platinum'),
    defaultValue: 'bronze'
  },
  points_earned_ytd: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  points_redeemed_ytd: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  last_activity_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true
});

CustomerLoyalty.belongsTo(Customer, { foreignKey: 'customer_id' });
CustomerLoyalty.belongsTo(LoyaltyProgram, { foreignKey: 'program_id' });
Customer.hasOne(CustomerLoyalty, { foreignKey: 'customer_id' });
LoyaltyProgram.hasMany(CustomerLoyalty, { foreignKey: 'program_id' });

module.exports = CustomerLoyalty;
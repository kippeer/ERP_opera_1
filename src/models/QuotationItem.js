const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Quotation = require('./Quotation');

const QuotationItem = sequelize.define('QuotationItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quotation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Quotation,
      key: 'id'
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  discount_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0
  },
  tax_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: true,
  underscored: true
});

QuotationItem.belongsTo(Quotation, { foreignKey: 'quotation_id' });
Quotation.hasMany(QuotationItem, { foreignKey: 'quotation_id' });

module.exports = QuotationItem;
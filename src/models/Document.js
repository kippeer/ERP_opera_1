const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  file_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  file_size: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  entity_type: {
    type: DataTypes.ENUM('customer', 'lead', 'opportunity', 'order', 'ticket'),
    allowNull: false
  },
  entity_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  uploaded_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  timestamps: true,
  underscored: true
});

module.exports = Document;
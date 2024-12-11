const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmailTemplate = sequelize.define('EmailTemplate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('welcome', 'newsletter', 'promotion', 'follow_up', 'survey'),
    allowNull: false
  },
  variables: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  underscored: true
});

module.exports = EmailTemplate;
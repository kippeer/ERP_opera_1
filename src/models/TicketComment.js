const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const SupportTicket = require('./SupportTicket');

const TicketComment = sequelize.define('TicketComment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ticket_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: SupportTicket,
      key: 'id'
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_internal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  underscored: true
});

TicketComment.belongsTo(SupportTicket, { foreignKey: 'ticket_id' });
SupportTicket.hasMany(TicketComment, { foreignKey: 'ticket_id' });

module.exports = TicketComment;
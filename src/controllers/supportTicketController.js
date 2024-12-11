const SupportTicket = require('../models/SupportTicket');
const TicketComment = require('../models/TicketComment');
const Customer = require('../models/Customer');
const ActivityLog = require('../models/ActivityLog');

exports.createTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.create(req.body);
    
    await ActivityLog.create({
      entity_type: 'ticket',
      entity_id: ticket.id,
      activity_type: 'status_change',
      description: 'New support ticket created',
      performed_by: req.body.created_by || 1
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const ticket = await SupportTicket.findByPk(req.params.id, {
      include: [
        { model: Customer },
        { model: TicketComment }
      ]
    });
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolution, notes } = req.body;
    
    const ticket = await SupportTicket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const oldStatus = ticket.status;
    await ticket.update({ 
      status,
      resolution: resolution || ticket.resolution
    });

    await ActivityLog.create({
      entity_type: 'ticket',
      entity_id: id,
      activity_type: 'status_change',
      description: `Ticket status changed from ${oldStatus} to ${status}${notes ? ': ' + notes : ''}`,
      performed_by: req.body.performed_by || 1
    });

    res.json(ticket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const comment = await TicketComment.create({
      ...req.body,
      ticket_id
    });

    await ActivityLog.create({
      entity_type: 'ticket',
      entity_id: ticket_id,
      activity_type: 'note',
      description: 'New comment added to ticket',
      performed_by: req.body.created_by || 1
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
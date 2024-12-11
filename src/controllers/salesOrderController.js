const SalesOrder = require('../models/SalesOrder');
const Customer = require('../models/Customer');
const SalesOpportunity = require('../models/SalesOpportunity');
const ActivityLog = require('../models/ActivityLog');

exports.createOrder = async (req, res) => {
  try {
    const order = await SalesOrder.create({
      ...req.body,
      order_number: `ORD-${Date.now()}`
    });

    await ActivityLog.create({
      entity_type: 'order',
      entity_id: order.id,
      activity_type: 'status_change',
      description: 'New order created',
      performed_by: req.body.performed_by || 1
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await SalesOrder.findByPk(req.params.id, {
      include: [
        { model: Customer },
        { model: SalesOpportunity }
      ]
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const order = await SalesOrder.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const oldStatus = order.status;
    await order.update({ status });

    await ActivityLog.create({
      entity_type: 'order',
      entity_id: id,
      activity_type: 'status_change',
      description: `Order status changed from ${oldStatus} to ${status}${notes ? ': ' + notes : ''}`,
      performed_by: req.body.performed_by || 1
    });

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
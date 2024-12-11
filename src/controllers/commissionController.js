const Commission = require('../models/Commission');
const SalesOrder = require('../models/SalesOrder');
const ActivityLog = require('../models/ActivityLog');

exports.calculateCommission = async (req, res) => {
  try {
    const { sales_order_id } = req.params;
    const { commission_rate } = req.body;

    const order = await SalesOrder.findByPk(sales_order_id);
    if (!order) {
      return res.status(404).json({ message: 'Sales order not found' });
    }

    const commission_amount = (order.total_value * commission_rate) / 100;

    const commission = await Commission.create({
      sales_order_id,
      employee_id: order.assigned_to,
      commission_rate,
      commission_amount,
      status: 'pending'
    });

    await ActivityLog.create({
      entity_type: 'commission',
      entity_id: commission.id,
      activity_type: 'status_change',
      description: 'Commission calculated and created',
      performed_by: req.body.performed_by || 1
    });

    res.status(201).json(commission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCommissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_date, notes } = req.body;

    const commission = await Commission.findByPk(id);
    if (!commission) {
      return res.status(404).json({ message: 'Commission not found' });
    }

    const oldStatus = commission.status;
    await commission.update({ 
      status,
      payment_date: status === 'paid' ? payment_date : null
    });

    await ActivityLog.create({
      entity_type: 'commission',
      entity_id: id,
      activity_type: 'status_change',
      description: `Commission status changed from ${oldStatus} to ${status}${notes ? ': ' + notes : ''}`,
      performed_by: req.body.performed_by || 1
    });

    res.json(commission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCommissionsByEmployee = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const commissions = await Commission.findAll({
      where: { employee_id },
      include: [SalesOrder]
    });
    res.json(commissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
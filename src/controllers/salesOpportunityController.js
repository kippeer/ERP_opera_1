const SalesOpportunity = require('../models/SalesOpportunity');
const Customer = require('../models/Customer');
const ActivityLog = require('../models/ActivityLog');

exports.getAllOpportunities = async (req, res) => {
  try {
    const opportunities = await SalesOpportunity.findAll({
      include: [{ model: Customer }]
    });
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createOpportunity = async (req, res) => {
  try {
    const opportunity = await SalesOpportunity.create(req.body);
    await ActivityLog.create({
      entity_type: 'opportunity',
      entity_id: opportunity.id,
      activity_type: 'status_change',
      description: 'New opportunity created',
      performed_by: req.body.assigned_to || 1
    });
    res.status(201).json(opportunity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateOpportunityStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage, notes } = req.body;
    
    const opportunity = await SalesOpportunity.findByPk(id);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    const oldStage = opportunity.stage;
    await opportunity.update({ stage });

    await ActivityLog.create({
      entity_type: 'opportunity',
      entity_id: id,
      activity_type: 'status_change',
      description: `Stage changed from ${oldStage} to ${stage}${notes ? ': ' + notes : ''}`,
      performed_by: req.body.performed_by || 1
    });

    res.json(opportunity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
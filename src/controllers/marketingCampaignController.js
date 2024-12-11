const MarketingCampaign = require('../models/MarketingCampaign');
const CampaignLead = require('../models/CampaignLead');
const Lead = require('../models/Lead');
const ActivityLog = require('../models/ActivityLog');
const emailService = require('../services/emailService');
const { logger } = require('../utils/logger');

exports.createCampaign = async (req, res) => {
  try {
    const campaign = await MarketingCampaign.create(req.body);
    
    await ActivityLog.create({
      entity_type: 'campaign',
      entity_id: campaign.id,
      activity_type: 'status_change',
      description: 'New marketing campaign created',
      performed_by: req.body.performed_by || 1
    });

    res.status(201).json(campaign);
  } catch (error) {
    logger.error(`Error creating campaign: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await MarketingCampaign.findByPk(req.params.id, {
      include: [{
        model: CampaignLead,
        include: [Lead]
      }]
    });
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    res.json(campaign);
  } catch (error) {
    logger.error(`Error fetching campaign: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.updateCampaignStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const campaign = await MarketingCampaign.findByPk(id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const oldStatus = campaign.status;
    await campaign.update({ status });

    await ActivityLog.create({
      entity_type: 'campaign',
      entity_id: id,
      activity_type: 'status_change',
      description: `Campaign status changed from ${oldStatus} to ${status}${notes ? ': ' + notes : ''}`,
      performed_by: req.body.performed_by || 1
    });

    res.json(campaign);
  } catch (error) {
    logger.error(`Error updating campaign status: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.addLeadsToCampaign = async (req, res) => {
  try {
    const { campaign_id } = req.params;
    const { lead_ids } = req.body;

    const campaign = await MarketingCampaign.findByPk(campaign_id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const campaignLeads = await Promise.all(
      lead_ids.map(lead_id => 
        CampaignLead.create({
          campaign_id,
          lead_id
        })
      )
    );

    res.status(201).json(campaignLeads);
  } catch (error) {
    logger.error(`Error adding leads to campaign: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.executeCampaignEmail = async (req, res) => {
  try {
    const { campaign_id } = req.params;
    const { template_id } = req.body;

    const campaign = await MarketingCampaign.findByPk(campaign_id, {
      include: [{
        model: CampaignLead,
        include: [Lead],
        where: { status: 'pending' }
      }]
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const recipients = campaign.CampaignLeads.map(cl => ({
      email: cl.Lead.email,
      variables: {
        lead_name: cl.Lead.name,
        campaign_name: campaign.name
      }
    }));

    const results = await emailService.sendBulkEmail(recipients, template_id);
    res.json(results);
  } catch (error) {
    logger.error(`Error executing campaign email: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};
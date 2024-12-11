const express = require('express');
const router = express.Router();
const marketingCampaignController = require('../controllers/marketingCampaignController');

router.post('/campaigns', marketingCampaignController.createCampaign);
router.get('/campaigns/:id', marketingCampaignController.getCampaignById);
router.put('/campaigns/:id/status', marketingCampaignController.updateCampaignStatus);
router.post('/campaigns/:campaign_id/leads', marketingCampaignController.addLeadsToCampaign);
router.post('/campaigns/:campaign_id/execute-email', marketingCampaignController.executeCampaignEmail);

module.exports = router;
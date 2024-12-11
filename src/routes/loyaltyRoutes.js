const express = require('express');
const router = express.Router();
const loyaltyController = require('../controllers/loyaltyController');

router.post('/programs', loyaltyController.createLoyaltyProgram);
router.post('/enroll', loyaltyController.enrollCustomer);
router.post('/points/award', loyaltyController.awardPoints);
router.post('/points/redeem', loyaltyController.redeemPoints);

module.exports = router;
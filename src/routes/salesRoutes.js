const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/salesOpportunityController');
const orderController = require('../controllers/salesOrderController');

// Opportunity routes
router.get('/opportunities', opportunityController.getAllOpportunities);
router.post('/opportunities', opportunityController.createOpportunity);
router.put('/opportunities/:id/stage', opportunityController.updateOpportunityStage);

// Order routes
router.post('/orders', orderController.createOrder);
router.get('/orders/:id', orderController.getOrderById);
router.put('/orders/:id/status', orderController.updateOrderStatus);

module.exports = router;
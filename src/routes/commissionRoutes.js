const express = require('express');
const router = express.Router();
const commissionController = require('../controllers/commissionController');

router.post('/orders/:sales_order_id/commission', commissionController.calculateCommission);
router.put('/commission/:id/status', commissionController.updateCommissionStatus);
router.get('/employees/:employee_id/commissions', commissionController.getCommissionsByEmployee);

module.exports = router;
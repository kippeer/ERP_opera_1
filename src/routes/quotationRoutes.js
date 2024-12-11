const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');

router.post('/quotations', quotationController.createQuotation);
router.get('/quotations/:id', quotationController.getQuotationById);
router.put('/quotations/:id/status', quotationController.updateQuotationStatus);
router.post('/quotations/:id/send', quotationController.sendQuotationEmail);

module.exports = router;
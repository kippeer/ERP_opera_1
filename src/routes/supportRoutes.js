const express = require('express');
const router = express.Router();
const supportTicketController = require('../controllers/supportTicketController');

router.post('/tickets', supportTicketController.createTicket);
router.get('/tickets/:id', supportTicketController.getTicketById);
router.put('/tickets/:id/status', supportTicketController.updateTicketStatus);
router.post('/tickets/:ticket_id/comments', supportTicketController.addComment);

module.exports = router;
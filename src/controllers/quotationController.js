const Quotation = require('../models/Quotation');
const QuotationItem = require('../models/QuotationItem');
const Customer = require('../models/Customer');
const SalesOpportunity = require('../models/SalesOpportunity');
const ActivityLog = require('../models/ActivityLog');
const { logger } = require('../utils/logger');
const { generateQuotePDF } = require('../utils/pdfGenerator');
const emailService = require('../services/emailService');

exports.createQuotation = async (req, res) => {
  try {
    const { items, ...quotationData } = req.body;
    quotationData.quote_number = `QT-${Date.now()}`;

    const quotation = await Quotation.create(quotationData);

    if (items && items.length > 0) {
      await QuotationItem.bulkCreate(
        items.map(item => ({ ...item, quotation_id: quotation.id }))
      );
    }

    await ActivityLog.create({
      entity_type: 'quotation',
      entity_id: quotation.id,
      activity_type: 'status_change',
      description: 'New quotation created',
      performed_by: req.body.created_by
    });

    res.status(201).json(quotation);
  } catch (error) {
    logger.error(`Error creating quotation: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findByPk(req.params.id, {
      include: [
        { model: QuotationItem },
        { model: Customer },
        { model: SalesOpportunity }
      ]
    });

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    res.json(quotation);
  } catch (error) {
    logger.error(`Error fetching quotation: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.updateQuotationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const quotation = await Quotation.findByPk(id);
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    const oldStatus = quotation.status;
    await quotation.update({ status, notes });

    await ActivityLog.create({
      entity_type: 'quotation',
      entity_id: id,
      activity_type: 'status_change',
      description: `Quotation status changed from ${oldStatus} to ${status}${notes ? ': ' + notes : ''}`,
      performed_by: req.body.performed_by
    });

    res.json(quotation);
  } catch (error) {
    logger.error(`Error updating quotation status: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.sendQuotationEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { email_template_id } = req.body;

    const quotation = await Quotation.findByPk(id, {
      include: [
        { model: QuotationItem },
        { model: Customer }
      ]
    });

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    const pdfBuffer = await generateQuotePDF(quotation);
    
    const emailResult = await emailService.sendEmail(
      quotation.Customer.email,
      email_template_id,
      {
        customer_name: quotation.Customer.name,
        quote_number: quotation.quote_number,
        total_amount: quotation.total_amount,
        valid_until: quotation.valid_until
      },
      [{
        filename: `quotation-${quotation.quote_number}.pdf`,
        content: pdfBuffer
      }]
    );

    await quotation.update({ status: 'sent' });

    res.json({ message: 'Quotation sent successfully', email: emailResult });
  } catch (error) {
    logger.error(`Error sending quotation email: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};
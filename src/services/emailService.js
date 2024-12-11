const nodemailer = require('nodemailer');
const EmailTemplate = require('../models/EmailTemplate');
const { logger } = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail(to, templateId, variables = {}) {
    try {
      const template = await EmailTemplate.findByPk(templateId);
      if (!template) {
        throw new Error('Email template not found');
      }

      let content = template.content;
      Object.entries(variables).forEach(([key, value]) => {
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });

      const result = await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject: template.subject,
        html: content
      });

      logger.info(`Email sent successfully to ${to}`);
      return result;
    } catch (error) {
      logger.error(`Error sending email: ${error.message}`);
      throw error;
    }
  }

  async sendBulkEmail(recipients, templateId, commonVariables = {}) {
    const results = [];
    for (const recipient of recipients) {
      try {
        const result = await this.sendEmail(
          recipient.email,
          templateId,
          { ...commonVariables, ...recipient.variables }
        );
        results.push({ success: true, email: recipient.email, result });
      } catch (error) {
        results.push({ success: false, email: recipient.email, error: error.message });
      }
    }
    return results;
  }
}

module.exports = new EmailService();
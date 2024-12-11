const PDFDocument = require('pdfkit');

async function generateQuotePDF(quotation) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Header
      doc.fontSize(20).text('Quotation', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Quote Number: ${quotation.quote_number}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);
      doc.text(`Valid Until: ${new Date(quotation.valid_until).toLocaleDateString()}`);
      
      // Customer Information
      doc.moveDown();
      doc.fontSize(14).text('Customer Information');
      doc.fontSize(12).text(`Name: ${quotation.Customer.name}`);
      doc.text(`Email: ${quotation.Customer.email}`);
      
      // Items Table
      doc.moveDown();
      doc.fontSize(14).text('Items');
      
      const tableTop = doc.y + 20;
      const itemsTable = {
        headers: ['Description', 'Quantity', 'Unit Price', 'Discount', 'Total'],
        rows: quotation.QuotationItems.map(item => [
          item.description,
          item.quantity.toString(),
          item.unit_price.toFixed(2),
          `${item.discount_percentage}%`,
          (item.quantity * item.unit_price * (1 - item.discount_percentage / 100)).toFixed(2)
        ])
      };

      let currentY = tableTop;
      
      // Draw Headers
      itemsTable.headers.forEach((header, i) => {
        doc.text(header, 50 + (i * 100), currentY);
      });
      
      currentY += 20;
      
      // Draw Rows
      itemsTable.rows.forEach(row => {
        row.forEach((cell, i) => {
          doc.text(cell, 50 + (i * 100), currentY);
        });
        currentY += 20;
      });
      
      // Total
      doc.moveDown();
      doc.fontSize(14).text(`Total Amount: $${quotation.total_amount}`, { align: 'right' });
      
      // Terms and Conditions
      if (quotation.terms_conditions) {
        doc.moveDown();
        doc.fontSize(14).text('Terms and Conditions');
        doc.fontSize(12).text(quotation.terms_conditions);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generateQuotePDF };
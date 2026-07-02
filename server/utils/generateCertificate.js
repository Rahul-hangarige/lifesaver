const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateCertificate = async (certificateData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
      const filename = `certificates/${certificateData.certificateNumber}.pdf`;
      
      // Ensure directory exists
      const dir = 'certificates';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      doc.pipe(fs.createWriteStream(filename));

      // Background
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8f9fa');

      // Border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
         .lineWidth(3)
         .stroke('#e74c3c');

      // Header
      doc.fontSize(40)
         .fill('#e74c3c')
         .font('Helvetica-Bold')
         .text('Certificate of Appreciation', { align: 'center' });

      // Subtitle
      doc.fontSize(20)
         .fill('#2c3e50')
         .font('Helvetica')
         .text('This certificate is proudly presented to', { align: 'center' });

      // Donor Name
      doc.moveDown(1)
         .fontSize(35)
         .fill('#e74c3c')
         .font('Helvetica-Bold')
         .text(certificateData.donorName, { align: 'center' });

      // Description
      doc.moveDown(1)
         .fontSize(16)
         .fill('#34495e')
         .font('Helvetica')
         .text('For their generous blood donation on', { align: 'center' });

      // Date
      doc.fontSize(20)
         .fill('#2c3e50')
         .font('Helvetica-Bold')
         .text(new Date(certificateData.donationDate).toLocaleDateString(), { align: 'center' });

      // Blood Group
      doc.moveDown(0.5)
         .fontSize(25)
         .fill('#e74c3c')
         .font('Helvetica-Bold')
         .text(`Blood Group: ${certificateData.bloodGroup}`, { align: 'center' });

      // Blood Bank
      doc.moveDown(0.5)
         .fontSize(14)
         .fill('#7f8c8d')
         .font('Helvetica')
         .text(`Issued by: ${certificateData.bloodBankName}`, { align: 'center' });

      // Certificate Number
      doc.moveDown(2)
         .fontSize(12)
         .fill('#95a5a6')
         .text(`Certificate No: ${certificateData.certificateNumber}`, { align: 'center' });

      // Footer
      doc.moveDown(1)
         .fontSize(10)
         .fill('#bdc3c7')
         .text('Every Drop Counts, Every Donor Matters', { align: 'center' });

      doc.end();

      doc.on('end', () => {
        resolve(filename);
      });

      doc.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateCertificate;

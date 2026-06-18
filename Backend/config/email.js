const nodemailer = require('nodemailer');

const createTransporter = () => {
  // Decode password in case it was URL-encoded when saved in env
  const pass = (process.env.EMAIL_PASS || '').replace(/%40/g, '@').replace(/%25/g, '%');

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    family: 4, // Force IPv4 — Render free tier blocks IPv6
    auth: {
      user: process.env.EMAIL_USER,
      pass: pass,
    },
  });
};

const sendOrderConfirmation = async (userEmail, userName, orderId, totalAmount, items, deliveryAddress) => {
  const PDFDocument = require('pdfkit');
  const doc = new PDFDocument({ margin: 50 });
  const chunks = [];
  doc.on('data', chunk => chunks.push(chunk));

  const pdfReady = new Promise(resolve => doc.on('end', () => resolve(Buffer.concat(chunks))));

  const invoiceNo = orderId.toString().slice(-6).toUpperCase();

  doc.rect(0, 0, 612, 80).fill('#1d4ed8');
  doc.fillColor('white').fontSize(24).font('Helvetica-Bold').text('RentEase', 50, 25);
  doc.fontSize(11).font('Helvetica').text('Tax Invoice', 50, 52);
  doc.fontSize(11).text(`Invoice #${invoiceNo}`, 400, 25, { align: 'right' });
  doc.text(new Date().toLocaleDateString('en-IN'), 400, 42, { align: 'right' });

  doc.fillColor('#111827').fontSize(11).font('Helvetica-Bold').text('Billed To', 50, 110);
  doc.font('Helvetica').fillColor('#374151').text(userName, 50, 128).text(userEmail, 50, 144);
  doc.font('Helvetica-Bold').fillColor('#111827').text('Delivery Address', 320, 110);
  doc.font('Helvetica').fillColor('#374151').text(deliveryAddress || '', 320, 128, { width: 200 });

  doc.moveTo(50, 190).lineTo(562, 190).strokeColor('#e5e7eb').stroke();
  doc.rect(50, 200, 512, 28).fill('#f9fafb');
  doc.fillColor('#6b7280').fontSize(10).font('Helvetica-Bold')
    .text('ITEM', 60, 209).text('TENURE', 280, 209, { width: 80, align: 'center' })
    .text('RATE', 370, 209, { width: 80, align: 'right' })
    .text('AMOUNT', 450, 209, { width: 100, align: 'right' });

  let y = 240;
  (items || []).forEach(item => {
    doc.fillColor('#111827').fontSize(11).font('Helvetica-Bold').text(item.name || 'Product', 60, y);
    doc.font('Helvetica').fillColor('#374151')
      .text(`${item.tenure} months`, 280, y, { width: 80, align: 'center' })
      .text(`₹${item.monthlyRent}/mo`, 370, y, { width: 80, align: 'right' })
      .text(`₹${(item.monthlyRent * item.tenure) + item.securityDeposit}`, 450, y, { width: 100, align: 'right' });
    doc.moveTo(50, y + 20).lineTo(562, y + 20).strokeColor('#e5e7eb').stroke();
    y += 32;
  });

  doc.rect(370, y + 10, 192, 40).fill('#eff6ff');
  doc.fillColor('#1d4ed8').fontSize(14).font('Helvetica-Bold')
    .text(`Total Paid: ₹${totalAmount}`, 380, y + 22, { width: 170, align: 'right' });
  doc.fillColor('#16a34a').fontSize(11).font('Helvetica').text('✓ Payment Successful', 50, y + 22);
  doc.moveTo(50, y + 70).lineTo(562, y + 70).strokeColor('#e5e7eb').stroke();
  doc.fillColor('#9ca3af').fontSize(10)
    .text('RentEase – Rent smarter, live better  ·  System-generated invoice', 50, y + 82, { align: 'center', width: 512 });

  doc.end();
  const pdfBuffer = await pdfReady;

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"RentEase" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Order Confirmed – Invoice #${invoiceNo} | RentEase`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:20px">
        <h2 style="color:#1d4ed8">🏠 RentEase</h2>
        <p>Hi <b>${userName}</b>,</p>
        <p>Your order <b>#${invoiceNo}</b> has been confirmed!</p>
        <p style="font-size:20px"><b>Total: ₹${totalAmount}</b></p>
        <p>Please find your invoice attached to this email.</p>
        <hr/>
        <p style="color:#6b7280;font-size:12px">RentEase – Rent smarter, live better.</p>
      </div>
    `,
    attachments: [{
      filename: `RentEase-Invoice-${invoiceNo}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf'
    }]
  });
};

const sendRentalConfirmation = async (userEmail, userName, productName, tenure, monthlyRent) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"RentEase" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: 'Rental Confirmed – RentEase',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:20px">
        <h2 style="color:#2563eb">🏠 RentEase</h2>
        <p>Hi <b>${userName}</b>,</p>
        <p>Your rental for <b>${productName}</b> is confirmed!</p>
        <p><b>Tenure:</b> ${tenure} months</p>
        <p><b>Monthly Rent:</b> ₹${monthlyRent}</p>
        <p style="font-size:20px"><b>Total: ₹${tenure * monthlyRent}</b></p>
        <hr/>
        <p style="color:#6b7280;font-size:12px">RentEase – Rent smarter, live better.</p>
      </div>
    `,
  });
};

module.exports = { sendOrderConfirmation, sendRentalConfirmation };
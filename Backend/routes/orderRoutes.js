const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/auth');
const Order = require('../models/Order');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getUserOrders);
router.get('/', protect, isAdmin, getAllOrders);
router.put('/:id', protect, isAdmin, updateOrderStatus);

const PDFDocument = require('pdfkit');

router.get('/:id/invoice', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name category');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=RentEase-Invoice-${order._id.toString().slice(-6).toUpperCase()}.pdf`);
    doc.pipe(res);

    // Header
    doc.rect(0, 0, 612, 80).fill('#1d4ed8');
    doc.fillColor('white').fontSize(24).font('Helvetica-Bold').text('RentEase', 50, 25);
    doc.fontSize(11).font('Helvetica').text('Tax Invoice', 50, 52);
    doc.fontSize(11).text(`Invoice #${order._id.toString().slice(-6).toUpperCase()}`, 400, 25, { align: 'right' });
    doc.text(new Date().toLocaleDateString('en-IN'), 400, 42, { align: 'right' });

    // Billing info
    doc.fillColor('#111827').fontSize(11).font('Helvetica-Bold').text('Billed To', 50, 110);
    doc.font('Helvetica').fillColor('#374151').fontSize(11)
      .text(order.user?.name || 'Customer', 50, 128)
      .text(order.user?.email || '', 50, 144);

    doc.font('Helvetica-Bold').fillColor('#111827').text('Delivery Address', 320, 110);
    doc.font('Helvetica').fillColor('#374151').text(order.deliveryAddress || '', 320, 128, { width: 200 });

    // Divider
    doc.moveTo(50, 190).lineTo(562, 190).strokeColor('#e5e7eb').stroke();

    // Table header
    doc.rect(50, 200, 512, 28).fill('#f9fafb');
    doc.fillColor('#6b7280').fontSize(10).font('Helvetica-Bold')
      .text('ITEM', 60, 209)
      .text('TENURE', 280, 209, { width: 80, align: 'center' })
      .text('RATE', 370, 209, { width: 80, align: 'right' })
      .text('AMOUNT', 450, 209, { width: 100, align: 'right' });

    // Table rows
    let y = 240;
    order.items.forEach(item => {
      doc.fillColor('#111827').fontSize(11).font('Helvetica-Bold')
        .text(item.product?.name || 'Product', 60, y);
      doc.font('Helvetica').fillColor('#374151')
        .text(`${item.tenure} months`, 280, y, { width: 80, align: 'center' })
        .text(`₹${item.monthlyRent}/mo`, 370, y, { width: 80, align: 'right' })
        .text(`₹${(item.monthlyRent * item.tenure) + item.securityDeposit}`, 450, y, { width: 100, align: 'right' });
      doc.moveTo(50, y + 20).lineTo(562, y + 20).strokeColor('#e5e7eb').stroke();
      y += 32;
    });

    // Total
    doc.rect(370, y + 10, 192, 40).fill('#eff6ff');
    doc.fillColor('#1d4ed8').fontSize(14).font('Helvetica-Bold')
      .text(`Total Paid: ₹${order.totalAmount}`, 380, y + 22, { width: 170, align: 'right' });

    // Payment status
    doc.fillColor('#16a34a').fontSize(11).font('Helvetica')
      .text('✓ Payment Successful via Razorpay', 50, y + 22);

    // Footer
    doc.moveTo(50, y + 70).lineTo(562, y + 70).strokeColor('#e5e7eb').stroke();
    doc.fillColor('#9ca3af').fontSize(10)
      .text('RentEase – Rent smarter, live better  ·  This is a system-generated invoice', 50, y + 82, { align: 'center', width: 512 });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Invoice generation failed', error: error.message });
  }
});

module.exports = router;
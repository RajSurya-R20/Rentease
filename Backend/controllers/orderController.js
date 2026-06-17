const Order = require('../models/Order');
const Product = require('../models/Product');
const Rental = require('../models/Rental');
const User = require('../models/User');
const { sendOrderConfirmation } = require('../config/email');

const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, deliveryDate } = req.body;

    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      if (!product.availability) {
        return res.status(400).json({ message: `Product not available: ${product.name}` });
      }
      totalAmount += (product.monthlyRent * item.tenure) + product.securityDeposit;
      item.monthlyRent = product.monthlyRent;
      item.securityDeposit = product.securityDeposit;
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      deliveryAddress,
      deliveryDate,
      totalAmount
    });

    // Create rentals and update product availability in parallel
    await Promise.all(items.map(async (item) => {
      const startDate = new Date(deliveryDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + item.tenure);

      await Promise.all([
        Rental.create({
          user: req.user.id,
          product: item.product,
          order: order._id,
          startDate,
          endDate,
          tenure: item.tenure,
          monthlyRent: item.monthlyRent,
          securityDeposit: item.securityDeposit
        }),
        Product.findByIdAndUpdate(item.product, { availability: false })
      ]);
    }));

    // Respond immediately — don't wait for email
    res.status(201).json({ message: 'Order placed successfully', order });

    // Send email in background (non-blocking)
    User.findById(req.user.id).then(async (user) => {
      try {
        const populatedOrder = await Order.findById(order._id).populate('items.product', 'name');
        await sendOrderConfirmation(
          user.email,
          user.name,
          order._id,
          totalAmount,
          populatedOrder.items.map(i => ({
            name: i.product?.name,
            tenure: i.tenure,
            monthlyRent: i.monthlyRent,
            securityDeposit: i.securityDeposit
          })),
          deliveryAddress
        );
      } catch (emailError) {
        console.log('Email failed (non-critical):', emailError.message);
      }
    }).catch(() => {});

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name category monthlyRent');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name category');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createOrder, getUserOrders, getAllOrders, updateOrderStatus };
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getUserOrders);
router.get('/', protect, isAdmin, getAllOrders);
router.put('/:id', protect, isAdmin, updateOrderStatus);

module.exports = router;
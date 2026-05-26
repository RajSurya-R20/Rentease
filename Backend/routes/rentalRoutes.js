const express = require('express');
const router = express.Router();
const {
  getUserRentals,
  getAllRentals,
  extendRental,
  returnRental
} = require('../controllers/rentalController');
const { protect, isAdmin } = require('../middleware/auth');

router.get('/myrentals', protect, getUserRentals);
router.get('/', protect, isAdmin, getAllRentals);
router.put('/:id/extend', protect, extendRental);
router.put('/:id/return', protect, returnRental);

module.exports = router;
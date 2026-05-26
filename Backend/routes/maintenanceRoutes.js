const express = require('express');
const router = express.Router();
const {
  createRequest,
  getUserRequests,
  getAllRequests,
  updateRequest
} = require('../controllers/maintenanceController');
const { protect, isAdmin } = require('../middleware/auth');

router.post('/', protect, createRequest);
router.get('/myrequests', protect, getUserRequests);
router.get('/', protect, isAdmin, getAllRequests);
router.put('/:id', protect, isAdmin, updateRequest);

module.exports = router;
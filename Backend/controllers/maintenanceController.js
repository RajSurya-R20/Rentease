const Maintenance = require('../models/Maintenance');

const createRequest = async (req, res) => {
  try {
    const { rental, product, issue, description } = req.body;

    const request = await Maintenance.create({
      user: req.user.id,
      rental,
      product,
      issue,
      description
    });

    res.status(201).json({ message: 'Maintenance request created', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserRequests = async (req, res) => {
  try {
    const requests = await Maintenance.find({ user: req.user.id })
      .populate('product', 'name category')
      .populate('rental', 'startDate endDate status');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const requests = await Maintenance.find()
      .populate('user', 'name email phone')
      .populate('product', 'name category')
      .populate('rental', 'startDate endDate');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateRequest = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const request = await Maintenance.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        adminNotes,
        resolvedAt: status === 'resolved' ? new Date() : undefined
      },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json({ message: 'Maintenance request updated', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createRequest, getUserRequests, getAllRequests, updateRequest };
const Rental = require('../models/Rental');
const Product = require('../models/Product');

const getUserRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ user: req.user.id })
      .populate('product', 'name category monthlyRent image')
      .populate('order', 'deliveryAddress status');
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate('user', 'name email phone')
      .populate('product', 'name category monthlyRent')
      .populate('order', 'deliveryAddress status');
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const extendRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    if (rental.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { extraMonths } = req.body;
    const newEndDate = new Date(rental.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + extraMonths);

    rental.endDate = newEndDate;
    rental.tenure = rental.tenure + extraMonths;
    rental.status = 'extended';
    await rental.save();

    res.json({ message: 'Rental extended successfully', rental });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const returnRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    if (rental.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    rental.status = 'returned';
    rental.returnDate = new Date();
    await rental.save();

    await Product.findByIdAndUpdate(rental.product, { availability: true });

    res.json({ message: 'Return scheduled successfully', rental });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUserRentals, getAllRentals, extendRental, returnRental };
const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  tenure: { type: Number, required: true },
  monthlyRent: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['active', 'extended', 'returned', 'overdue'], 
    default: 'active' 
  },
  returnDate: { type: Date },
  damageReport: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Rental', rentalSchema);
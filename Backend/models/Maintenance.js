const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rental: { type: mongoose.Schema.Types.ObjectId, ref: 'Rental', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  issue: { type: String, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['open', 'in-progress', 'resolved'], 
    default: 'open' 
  },
  adminNotes: { type: String },
  resolvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
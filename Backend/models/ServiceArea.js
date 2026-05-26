const mongoose = require('mongoose');

const serviceAreaSchema = new mongoose.Schema({
  city: { type: String, required: true, unique: true },
  state: { type: String, required: true },
  pinCodes: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ServiceArea', serviceAreaSchema);s
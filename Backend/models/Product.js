const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { 
    type: String, 
    enum: ['Furniture', 'Appliances'], 
    required: true 
  },
  subCategory: { 
    type: String, 
    enum: ['Bed', 'Sofa', 'Table', 'Fridge', 'Washing Machine', 'TV', 'Other'] 
  },
  monthlyRent: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  tenureOptions: [{ type: Number }],
  availability: { type: Boolean, default: true },
  stock: { type: Number, default: 1 },
  image: { type: String },
  city: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
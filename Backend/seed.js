require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const products = [
  { name: "3 Seater Sofa", description: "Comfortable fabric sofa set", category: "Furniture", subCategory: "Sofa", monthlyRent: 999, securityDeposit: 2000, tenureOptions: [3,6,12], stock: 5, city: "Chennai", availability: true },
  { name: "King Size Bed", description: "Comfortable king size bed with headboard", category: "Furniture", subCategory: "Bed", monthlyRent: 1299, securityDeposit: 2500, tenureOptions: [3,6,12], stock: 3, city: "Chennai", availability: true },
  { name: "Study Table", description: "Wooden study table with drawer", category: "Furniture", subCategory: "Table", monthlyRent: 499, securityDeposit: 1000, tenureOptions: [3,6,12], stock: 5, city: "Chennai", availability: true },
  { name: "Double Door Fridge", description: "250L double door refrigerator", category: "Appliances", subCategory: "Fridge", monthlyRent: 1199, securityDeposit: 2500, tenureOptions: [3,6,12], stock: 2, city: "Chennai", availability: true },
  { name: "Washing Machine", description: "7kg fully automatic washing machine", category: "Appliances", subCategory: "Washing Machine", monthlyRent: 899, securityDeposit: 2000, tenureOptions: [3,6,12], stock: 3, city: "Chennai", availability: true },
  { name: "55 inch Smart TV", description: "Full HD Android Smart TV", category: "Appliances", subCategory: "TV", monthlyRent: 1499, securityDeposit: 3000, tenureOptions: [3,6,12], stock: 2, city: "Chennai", availability: true },
  { name: "2 Seater Sofa", description: "Compact loveseat sofa", category: "Furniture", subCategory: "Sofa", monthlyRent: 699, securityDeposit: 1500, tenureOptions: [3,6,12], stock: 4, city: "Mumbai", availability: true },
  { name: "Single Bed", description: "Single bed with mattress", category: "Furniture", subCategory: "Bed", monthlyRent: 799, securityDeposit: 1500, tenureOptions: [3,6,12], stock: 4, city: "Mumbai", availability: true },
  { name: "Mini Fridge", description: "100L single door mini fridge", category: "Appliances", subCategory: "Fridge", monthlyRent: 699, securityDeposit: 1500, tenureOptions: [3,6,12], stock: 3, city: "Mumbai", availability: true },
  { name: "32 inch LED TV", description: "HD LED TV perfect for bedroom", category: "Appliances", subCategory: "TV", monthlyRent: 799, securityDeposit: 1500, tenureOptions: [3,6,12], stock: 3, city: "Bangalore", availability: true },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 30000 });
  console.log('MongoDB connected');

  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('✅ Products seeded');

  const existing = await User.findOne({ email: 'admin@rentease.com' });
  if (!existing) {
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin User',
      email: 'admin@rentease.com',
      password: hashed,
      phone: '9999999999',
      address: 'Chennai, Tamil Nadu',
      role: 'admin'
    });
    console.log('✅ Admin user created');
  } else {
    console.log('ℹ️ Admin already exists');
  }

  mongoose.disconnect();
  console.log('Done!');
};

seed().catch(console.error);
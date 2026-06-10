require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const user = await User.findOne({ email: 'admin@rentease.com' });
  console.log('User found:', user);
  mongoose.disconnect();
});
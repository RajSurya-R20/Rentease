require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hashed = await bcrypt.hash('admin123', 10);
  await User.findOneAndUpdate({ email: 'admin@rentease.com' }, { password: hashed });
  console.log('✅ Admin password reset to admin123');
  mongoose.disconnect();
});
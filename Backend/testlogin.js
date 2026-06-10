require('dotenv').config();
const bcrypt = require('bcryptjs');

const stored = '$2b$10$DKUW7.yWymxVKcbr2RJbg.ZLOUUNY8zFOTFjiWqkKLh9kOZfSAcYC';
bcrypt.compare('admin123', stored).then(result => {
  console.log('Password match:', result);
});
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const promoteUser = async () => {
  const email = 'pathakaayushman57@gmail.com';
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User with email ${email} not found.`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();
    console.log(`Successfully promoted ${email} to admin!`);
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

promoteUser();

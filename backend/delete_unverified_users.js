const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Delete only unverified users
    const result = await User.deleteMany({ isVerified: false });
    console.log(`Deleted ${result.deletedCount} unverified users.`);
    
  } catch (err) {
    console.error('Error during cleanup:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

cleanup();

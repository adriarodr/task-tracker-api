const mongoose = require('mongoose');

// Load the variables form the .env file
require('dotenv').config();

const connectDB = () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;

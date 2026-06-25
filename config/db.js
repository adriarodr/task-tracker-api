const mongoose = require('mongoose');

const connectDB = () => {
  // Initial connection to MongoDB
  mongoose
    .connect(process.env.MONGO_URI)
    .catch((err) => console.log('Database connection error:', err));

  // Connection events for when something happens after initial connection
  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('Reconnected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.log('Database connection error: ', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Database disconnected');
  });
};

module.exports = connectDB;

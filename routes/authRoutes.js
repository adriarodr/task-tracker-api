const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/User');

// Helper function to generate a JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );
};

// @route POST /api/auth/register
// @desc Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if all fields are included
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please provide name, email and password',
      });
    }

    // Hashes the password before storing it
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user using the User Schema
    const newUser = new User({
      name: name,
      email: email,
      password: hashPassword,
    });

    // Save the user in the database
    const savedUser = await newUser.save();

    // Return the user information
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      // Return error message if user with this email already exists
      return res.status(400).json({
        message: 'A user with this email already exists',
      });
    }

    res.status(500).json({
      message: 'Server error during registration',
      error: error.message,
    });
  }
});

// @route POST /api/auth/login
// @desc Log in an existing user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if all fields are included
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide email and password' });
    }

    // Find the user by email
    const user = await User.findOne({ email }).select('+password');

    // If the user does not exist, return an error
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the entered password to the stored hashed password
    const isSamePassword = await bcrypt.compare(password, user.password);

    if (!isSamePassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a new token after successful login
    const jwtToken = generateToken(user);

    // Return the user information and token
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: jwtToken,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error during login',
      error: error.message,
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// Registration Route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      email: email,
      password: hash,
    });
    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
    });
  } catch (error) {
    // TODO: Write better error handling
    if (!name | !email | !password) {
      res.status(400).json({
        message: 'Name, email and password are required',
      });
    } else if (error.code === 11000) {
      res.status(400).json({
        message: 'Account with that email already exist',
      });
    } else {
      res.status(400).json({
        message: 'Unable to create account',
      });
    }
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if all fields are included
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the entered password with stored hashed password
    const isSamePassword = await bcrypt.compare(password, user.password);

    if (!isSamePassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Return a JWT token if login is successful
    const jwtToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

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
      message: 'Server Error',
    });
  }
});

module.exports = router;

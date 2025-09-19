const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate a token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
exports.registerUser = async (req, res) => {
  const { email, idCardNumber, password } = req.body;

  try {
    const isIdCardValid = /^\d{15}$/.test(idCardNumber) && idCardNumber.startsWith('230');
    if (!isIdCardValid) {
      return res.status(400).json({ message: 'The provided ID Card Number is invalid.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists. Please log in.' });
    }
    
    const user = await User.create({
      email,
      idCardNumber,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        isProfileComplete: user.isProfileComplete,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
        profilePic: user.profilePic,
        group: user.group,
        year: user.year,
        isProfileComplete: user.isProfileComplete,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Employee = require('../models/Employee'); // Assuming you have this model
const jwt = require('jsonwebtoken');

// Signup endpoint
router.post('/signup', async (req, res) => {
  const { empId, email, department } = req.body;

  try {
    const employee = await Employee.findOne({ EMP_ID: empId, EMAIL_ADDRESS: email, DEPARTMENT: department });
    if (!employee) {
      return res.status(404).json({ message: 'Employee verification failed. Please check your details.' });
    }

    const existingUser = await User.findOne({ empId });
    if (existingUser) {
      return res.status(400).json({ message: 'Account already exists. Please sign in.' });
    }

    const defaultPassword = 'CBE@1234';
    const newUser = new User({ empId, email, department, password: defaultPassword });
    await newUser.save();

    res.status(201).json({ message: `Account created successfully! Your default password is: ${defaultPassword}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { empId, password, rememberMe } = req.body;

  try {
    const user = await User.findOne({ empId }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'No account found. Please sign up first.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, empId: user.empId }, process.env.JWT_SECRET, { expiresIn: rememberMe ? '7d' : '8h' });
    const userData = user.toObject();
    delete userData.password;

    res.json({ message: 'Login successful', token, user: userData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
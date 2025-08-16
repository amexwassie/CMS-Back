const express = require('express');
const router = express.Router();
const DataCenter = require('../models/DataCenter'); // Adjust the path if necessary

// Define your routes...
router.get('/', async (req, res) => {
  try {
    const dataCenters = await DataCenter.find().sort({ createdAt: -1 });
    res.json(dataCenters);
  } catch (err) {
    console.error('Error fetching data centers:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Create a new department
router.post('/', async (req, res) => {
  try {
    const DataCenter = new DataCenter(req.body);
    await DataCenter.save();
    res.status(201).json(department);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'DataCenter code must be unique' });
    }
    res.status(400).json({ error: err.message });
  }
});

// Update a department
router.put('/:id', async (req, res) => {
  try {
    const updatedDepartment = await DataCenter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedDepartment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a department
router.delete('/:id', async (req, res) => {
  try {
    await DataCenter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get count of departments
router.get('/count', async (req, res) => {
  try {
    const count = await DataCenter.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch department count' });
  }
});

module.exports = router;
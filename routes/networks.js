const express = require('express');
const router = express.Router();
const NetworkDevice = require('../models/NetworkDevice');

// Get all network devices
router.get('/', async (req, res) => {
  try {
    const devices = await NetworkDevice.find().sort({ createdAt: -1 });
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new network device
router.post('/', async (req, res) => {
  try {
    const device = new NetworkDevice(req.body);
    await device.save();
    res.status(201).json(device);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      const message = `${field === 'ciID' ? 'CI ID' : 'Serial Number'} must be unique`;
      return res.status(400).json({ error: message });
    }
    res.status(400).json({ error: err.message });
  }
});

// Update a network device
router.put('/:id', async (req, res) => {
  try {
    const updatedDevice = await NetworkDevice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updatedDevice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a network device
router.delete('/:id', async (req, res) => {
  try {
    await NetworkDevice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Network device deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Count endpoint for network devices
router.get('/count', async (req, res) => {
  try {
    const count = await NetworkDevice.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch device count' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Rack = require('../models/Rack');

// Get all racks with populated data centers
router.get('/', async (req, res) => {
  try {
    const racks = await Rack.find().populate('dataCenterID').sort({ createdAt: -1 });
    console.log('Racks with populated data centers:', racks); // Debugging line
    res.json(racks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new rack
router.post('/', async (req, res) => {
  console.log("Received rack data:", req.body);
  try {
    const rack = new Rack(req.body);
    await rack.save();
    res.status(201).json(rack);
  } catch (err) {
    if (err.code === 11000) { // Duplicate key error code
      return res.status(400).json({ error: 'RackID must be unique' });
    }
    res.status(400).json({ error: err.message });
  }
});

// Update a rack
router.put('/:id', async (req, res) => {
  try {
    const updatedRack = await Rack.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRack) {
      return res.status(404).json({ error: 'Rack not found' });
    }
    res.json(updatedRack);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a rack
router.delete('/:id', async (req, res) => {
  try {
    const deletedRack = await Rack.findByIdAndDelete(req.params.id);
    if (!deletedRack) {
      return res.status(404).json({ error: 'Rack not found' });
    }
    res.json({ message: 'Rack deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get the total count of racks
router.get('/count', async (req, res) => {
  try {
    const count = await Rack.countDocuments(); 
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rack count' });
  }
});

module.exports = router;
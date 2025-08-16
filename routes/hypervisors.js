const express = require('express');
const router = express.Router();
const Hypervisor = require('../models/Hypervisor');

// Get all hypervisors
router.get('/', async (req, res) => {
  try {
    const hypervisors = await Hypervisor.find().sort({ createdAt: -1 });
    res.json(hypervisors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new hypervisor
router.post('/', async (req, res) => {
  try {
    const hypervisor = new Hypervisor(req.body);
    await hypervisor.save();
    res.status(201).json(hypervisor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a hypervisor
router.put('/:id', async (req, res) => {
  try {
    const updatedHypervisor = await Hypervisor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedHypervisor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a hypervisor
router.delete('/:id', async (req, res) => {
  try {
    await Hypervisor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hypervisor deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
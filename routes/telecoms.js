const express = require('express');
const router = express.Router();
const Telecom = require('../models/Telecom');

// Get all telecoms
router.get('/', async (req, res) => {
  try {
    const telecoms = await Telecom.find().sort({ createdAt: -1 });
    res.json(telecoms);
  } catch (err) {
    console.error('Error fetching telecoms:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create a new telecom
router.post('/', async (req, res) => {
  try {
    const telecom = new Telecom(req.body);
    await telecom.save();
    res.status(201).json(telecom);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a telecom
router.put('/:id', async (req, res) => {
  try {
    const updatedTelecom = await Telecom.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTelecom) {
      return res.status(404).json({ error: 'Telecom record not found' });
    }
    res.json(updatedTelecom);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a telecom
router.delete('/:id', async (req, res) => {
  try {
    const deletedTelecom = await Telecom.findByIdAndDelete(req.params.id);
    if (!deletedTelecom) {
      return res.status(404).json({ error: 'Telecom record not found' });
    }
    res.json({ message: 'Telecom record deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get telecoms count
router.get('/count', async (req, res) => {
  try {
    const count = await Telecom.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error fetching telecoms count:', error);
    res.status(500).json({ error: 'Failed to fetch telecoms count' });
  }
});

module.exports = router;
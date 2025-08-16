const express = require('express');
const router = express.Router();
const ServerRegistration = require('../models/Server');

// Get all server registrations
router.get('/', async (req, res) => {
  try {
    const registrations = await ServerRegistration.find().sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new server registration
router.post('/', async (req, res) => {
  try {
    const registration = new ServerRegistration(req.body);
    
    // Validate required fields
    if (!registration.ciId || !registration.ciName || !registration.hostname) {
      return res.status(400).json({ error: 'ciId, ciName, and hostname are required' });
    }

    await registration.save();
    res.status(201).json(registration);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'ciId must be unique' });
    }
    res.status(400).json({ error: err.message });
  }
});

// Update a server registration
router.put('/:id', async (req, res) => {
  try {
    const updatedRegistration = await ServerRegistration.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedRegistration) {
      return res.status(404).json({ error: 'Server registration not found' });
    }

    res.json(updatedRegistration);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a server registration
router.delete('/:id', async (req, res) => {
  try {
    const deletedRegistration = await ServerRegistration.findByIdAndDelete(req.params.id);
    
    if (!deletedRegistration) {
      return res.status(404).json({ error: 'Server registration not found' });
    }
    
    res.json({ 
      message: 'Server registration deleted successfully',
      deletedId: deletedRegistration._id,
      ciName: deletedRegistration.ciName 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
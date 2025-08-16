const express = require('express');
const router = express.Router();
const Role = require('../models/Roler');

// Get all roles
router.get('/', async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new role
router.post('/', async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();
    res.status(201).json(role);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a role
router.put('/:id', async (req, res) => {
  try {
    const updatedRole = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRole);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a role
router.delete('/:id', async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.id);
    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
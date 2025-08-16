const express = require('express');
const router = express.Router();
const Department = require('../models/Department');

// Get all departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new department
router.post('/', async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    res.status(201).json(department);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a department
router.put('/:id', async (req, res) => {
  try {
    const updatedDepartment = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedDepartment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a department
router.delete('/:id', async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
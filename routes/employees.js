const express = require('express');
const router = express.Router();
const { Employee, upload, uploadEmployeeData } = require('../models/Employee');

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/departments', async (req, res) => {
  try {
    const departments = await Employee.distinct('DEPARTMENT'); // Fetch unique department names
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Create a new employee
router.post('/', async (req, res) => {
  const employee = new Employee(req.body);
  try {
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update an employee
router.put('/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(updatedEmployee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an employee
router.delete('/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Upload endpoint for employee data from an Excel file
router.post('/upload', upload.single('excelFile'), uploadEmployeeData);

module.exports = router;
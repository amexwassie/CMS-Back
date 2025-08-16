const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { upload, uploadEmployeeData } = require('../models/Employee'); // Ensure upload is imported

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new employee
router.post('/', async (req, res) => {
  try {
    const employee = new Employee(req.body);

    // Validate required fields
    if (!employee.EMP_ID || !employee.EMP_NAME || !employee.EMAIL_ADDRESS) {
      return res.status(400).json({ error: 'EMP_ID, EMP_NAME, and EMAIL_ADDRESS are required' });
    }

    // Check for duplicate EMP_ID
    const existingEmployee = await Employee.findOne({ EMP_ID: employee.EMP_ID });
    if (existingEmployee) {
      return res.status(409).json({ error: `Employee with ID ${employee.EMP_ID} already exists` });
    }

    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ 
      error: err.message,
      ...(err.name === 'ValidationError' && { details: err.errors })
    });
  }
});

// Update an employee
router.put('/:id', async (req, res) => {
  try {
    // Prevent EMP_ID modification
    if (req.body.EMP_ID) {
      return res.status(400).json({ error: 'EMP_ID cannot be modified' });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(updatedEmployee);
  } catch (err) {
    res.status(400).json({ 
      error: err.message,
      ...(err.name === 'ValidationError' && { details: err.errors })
    });
  }
});

// Delete an employee
router.delete('/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);

    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ 
      message: 'Employee deleted successfully',
      deletedId: deletedEmployee._id,
      empName: deletedEmployee.EMP_NAME
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Upload endpoint for employee data from an Excel file
router.post('/upload', upload.single('excelFile'), uploadEmployeeData);

module.exports = router;

// Health check endpoint (can be moved to a separate router if needed)
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    dbState: mongoose.connection.readyState 
  });
});
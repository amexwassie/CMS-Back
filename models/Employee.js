const mongoose = require('mongoose');
const multer = require('multer');
const xlsx = require('xlsx');

// Define the Employee schema
const employeeSchema = new mongoose.Schema({
  EMP_ID: { type: String, required: true, unique: true },
  EMP_NAME: { type: String, required: true },
  EMAIL_ADDRESS: { type: String, required: true },
  SUPERVISOR_NAME: String,
  STATUS: String,
  UNIT_NAME: String,
  ROLE: String,
  POSITION: String,
  GRADE: String,
  JOBCAT: String,
  SALARY: Number,
  SECTOR: String,
  DIVISION: String,
  DEPARTMENT: String
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema, 'employee_information');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload endpoint for employee data from an Excel file
const uploadEmployeeData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (!data.length) {
      return res.status(400).json({ message: 'Excel file contains no data' });
    }

    // Transform data
    const employees = data.map(row => ({
      EMP_ID: row.EMP_ID || row['Employee ID'],
      EMP_NAME: row.EMP_NAME || row['Employee Name'],
      EMAIL_ADDRESS: row.EMAIL_ADDRESS || row['Email Address'],
      SUPERVISOR_NAME: row.SUPERVISOR_NAME || row['Supervisor Name'],
      STATUS: row.STATUS || row.Status,
      UNIT_NAME: row.UNIT_NAME || row['Unit Name'],
      ROLE: row.ROLE || row.Role,
      POSITION: row.POSITION || row.Position,
      GRADE: row.GRADE || row.Grade,
      JOBCAT: row.JOBCAT || row.JobCategory,
      SALARY: row.SALARY || row.Salary,
      SECTOR: row.SECTOR || row.Sector,
      DIVISION: row.DIVISION || row.Division,
      DEPARTMENT: row.DEPARTMENT || row.Department
    }));

    // Batch insert
    const result = await Employee.insertMany(employees, {
      ordered: false,
      rawResult: true
    });

    const insertedCount = result.insertedCount;
    const errors = result.writeErrors || [];

    res.status(201).json({
      message: `Upload successful. Inserted: ${insertedCount}, Errors: ${errors.length}`,
      details: errors.map(e => e.errmsg)
    });
  } catch (error) {
    console.error('Upload error:', error);

    let message = 'Server error';
    if (error.name === 'ValidationError') {
      message = 'Data validation failed';
    } else if (error.code === 11000) {
      message = 'Duplicate employee ID found';
    }

    res.status(500).json({
      message,
      error: error.message
    });
  }
};

module.exports = {
  Employee,
  upload,
  uploadEmployeeData
};
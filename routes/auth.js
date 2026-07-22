const express = require('express');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// --- Login ---
// --- Fetch Departments ---
router.get('/departments', async (req, res) => {
  try {
    const departments = await Employee.distinct('DEPARTMENT'); // Fetch unique departments
    res.json(departments);
  } catch (err) {
    console.error("Fetch departments error:", err);
    return res.status(500).json({ message: "Failed to fetch departments" });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { empId, department } = req.body;

    if (!empId || !department) {
      return res.status(400).json({ message: "Employee ID and department are required." });
    }

    // Check if employee exists
    const emp = await Employee.findOne({ EMP_ID: empId });
    if (!emp) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check department match
    if (emp.DEPARTMENT.toLowerCase() !== department.toLowerCase()) {
      return res.status(401).json({ message: "Department does not match employee information." });
    }

    // Generate token
    const token = jwt.sign(
      { EMP_ID: emp.EMP_ID, DEPARTMENT: emp.DEPARTMENT },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});



module.exports = router;
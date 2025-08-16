const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  UnitID: { type: String, required: true, unique: true },
  unitName: { type: String, required: true },
  divisionName: { type: String, required: true },
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  roleId: { type: String, required: true, unique: true },
  roleName: { type: String, required: true },
  grade: { type: String, required: true },
  category: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
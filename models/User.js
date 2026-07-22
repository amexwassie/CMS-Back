const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  empId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  department: { 
    type: String, 
    required: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  passwordResetRequired: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, { 
  collection: "users", 
  timestamps: true 
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  service: { type: String, required: true },
  name: { type: String, required: true },
  number: String,
  owner: String,
  mode: String,
  site: String,
  type: String,
  model: String,
  dependence: String,
  criticality: String,
  value: String,
  license: String,
  availability: String,
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);
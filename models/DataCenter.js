const mongoose = require('mongoose');

// Define the schema
const dataCenterSchema = new mongoose.Schema({
  DCCode: { type: String, required: true, unique: true },
  dataCenterName: { type: String, required: true },
  location: { type: String, required: true },
  rackCapacity: { type: Number, required: true },
  currentRackCount: { type: Number, required: true },
  powerSource: { type: String },
  coolingType: { type: String },
  fireSuppression: { type: String },
  accessControl: { type: String },
  tierLevel: { type: String, required: true },
  operationalSince: { type: Date, required: true },
  maintenanceSchedule: { type: String, required: true },
  responsibleTeam: { type: String },
  upstreamDependency: { type: String },
  downstreamDependency: { type: String },
}, { timestamps: true });

// Export the model
const DataCenter = mongoose.model('DataCenter', dataCenterSchema);
module.exports = DataCenter;
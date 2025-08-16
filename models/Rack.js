const mongoose = require('mongoose');

const rackSchema = new mongoose.Schema({
  RackID: { type: String, required: true, unique: true },
  rackName: { type: String, required: true },
  dataCenterID: { type: mongoose.Schema.Types.ObjectId, ref: 'DataCenter', required: true },
  roomZoneID: { type: String },
  heightU: { type: Number, required: true },
  availableSpaceU: { type: Number, required: true },
  powerCapacityKW: { type: Number, required: true },
  currentPowerUsage: { type: Number, required: true },
  coolingZoneID: { type: String },
  physicalAccess: { type: String },
  grounded: { type: String },
  occupiedDevices: { type: String },
  monitoringEnabled: { type: String },
  operationalStatus: { type: String },
  commissionedDate: { type: Date },
  maintenanceSchedule: { type: String },
  responsibleTeam: { type: String },
  upstreamDependency: { type: String },
  downstreamDependency: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Rack', rackSchema);
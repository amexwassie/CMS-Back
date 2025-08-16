const mongoose = require('mongoose');

const networkDeviceSchema = new mongoose.Schema({
  ciClass: { type: String, default: 'Network Device' },
  ciSubClass: { type: String, required: true, enum: ['Router', 'Switch', 'Firewall', 'Load Balancer', 'Wireless Controller'] },
  ciID: { type: String, required: true, unique: true },
  deviceName: { type: String, required: true },
  deviceType: { type: String, required: true, enum: ['Layer 2 Switch', 'Layer 3 Router', 'NGFW', 'Load Balancer', 'Wireless Controller'] },
  vendorModel: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  operatingSystem: { type: String, required: true },
  ipAddress: { type: String, required: true },
  macAddress: String,
  portConfiguration: String,
  location: { type: String, required: true },
  connectedDevices: String,
  upstreamConnection: String,
  downstreamConnection: String,
  securityZone: { type: String, enum: ['DMZ', 'Internal', 'External', 'Management'] },
  redundancy: { type: String, enum: ['Yes', 'No'] },
  powerSource: { type: String, enum: ['Main', 'UPS', 'Dual-Power'] },
  commissionedDate: Date,
  firmwareLastUpdated: Date,
  sla: String,
  monitoringTool: String,
  responsibleTeam: String,
  changeHistoryRef: String,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('NetworkDevice', networkDeviceSchema);
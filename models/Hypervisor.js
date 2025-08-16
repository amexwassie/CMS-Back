const mongoose = require('mongoose');

const hypervisorSchema = new mongoose.Schema({
  ciId: { type: String, required: true, unique: true, match: /^HV-\d{3}$/ },
  name: { type: String, required: true, index: true },
  type: { type: String, required: true, enum: ['VMware ESXi', 'Microsoft Hyper-V', 'KVM', 'Proxmox', 'Xen'] },
  version: { type: String, required: true },
  managementIp: { type: String, match: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/ },
  hostServer: { type: mongoose.Schema.Types.ObjectId, ref: 'PhysicalServer' },
  cluster: { type: mongoose.Schema.Types.ObjectId, ref: 'VMCluster' },
  status: { type: String, required: true, enum: ['Active', 'Maintenance', 'Retired'], default: 'Active' },
  commissionDate: Date,
  notes: String,
  vms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VirtualMachine' }],
  capacity: {
    cpuCores: Number,
    totalRAM: Number,
    storage: Number
  },
  utilization: {
    cpuUsage: Number,
    ramUsage: Number,
    storageUsage: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Hypervisor', hypervisorSchema);
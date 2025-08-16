const mongoose = require('mongoose');

const vmClusterSchema = new mongoose.Schema({
  clusterId: { type: String, required: true, unique: true, match: /^CL-\d{3}$/ },
  name: { type: String, required: true, index: true },
  type: { type: String, required: true, enum: ['vSphere', 'Hyper-V', 'KVM', 'Proxmox'] },
  description: String,
  features: {
    haEnabled: { type: Boolean, default: false },
    drEnabled: { type: Boolean, default: false },
    ftEnabled: { type: Boolean, default: false }
  },
  status: { type: String, required: true, enum: ['Active', 'Standby', 'Maintenance'], default: 'Active' },
  hypervisors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hypervisor' }],
  virtualMachines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VirtualMachine' }],
  resourcePool: {
    cpuLimit: Number,
    memoryLimit: Number,
    storageLimit: Number
  },
  networking: {
    vSwitch: String,
    portGroup: String,
    vlanId: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('VMCluster', vmClusterSchema);
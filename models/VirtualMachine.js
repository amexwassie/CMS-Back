const mongoose = require('mongoose');

const virtualMachineSchema = new mongoose.Schema({
  Id: {
    type: String,
    required: true,
    unique: true,
    match: /^VM-\d{4}$/
  },
  Name: {
    type: String,
    required: true,
    index: true
  },
  hostname: String,
  ciType: {
    type: String,
    required: true, 
    enum: [
      'Application VM',
      'Database VM',
      'Web Server VM',
      'File Server VM',
      'Middleware VM',
      'Utility VM'
    ]
  },
  hypervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hypervisor',
    required: true
  },
  cluster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VMCluster'
  },
  owner: {
    department: String,
    primary: {
      name: String,
      employeeId: String,
      contact: String
    },
    secondary: {
      name: String,
      contact: String
    }
  },
  technical: {
    vCPU: { type: Number, min: 1, required: true },
    ram: { type: Number, min: 1, required: true }, // in GB
    diskSize: { type: Number, min: 1, required: true }, // in GB
    diskType: {
      type: String,
      enum: ['Thin Provisioned', 'Thick Provisioned', 'Eager Zeroed'],
      default: 'Thin Provisioned'
    },
    os: {
      name: { type: String, required: true },
      version: String,
      architecture: { type: String, enum: ['32-bit', '64-bit'] }
    },
    ipAddresses: [String],
    vlanIds: [String],
    nicCount: { type: Number, default: 1 },
    snapshots: {
      policy: String,
      lastSnapshot: Date
    },
    backups: {
      status: { type: Boolean, default: false },
      lastBackup: Date,
      backupTool: String
    }
  },
  dependencies: {
    upstream: [{
      type: { type: String, enum: ['Hypervisor', 'Physical Server', 'Storage'] },
      refId: mongoose.Schema.Types.ObjectId
    }],
    downstream: [{
      type: { type: String, enum: ['Application', 'Database', 'Service'] },
      refId: mongoose.Schema.Types.ObjectId
    }]
  },
  criticality: {
    businessCriticality: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium'
    },
    slaImpact: String,
    riskRating: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium'
    }
  },
  status: {
    lifecycle: {
      type: String,
      enum: ['Active', 'In Maintenance', 'Retired'],
      default: 'Active'
    },
    commissionDate: { type: Date, default: Date.now },
    decommissionDate: Date,
    lastUpdated: Date
  },
  monitoring: {
    tool: String,
    agentInstalled: Boolean,
    monitoringURL: String
  },
  security: {
    encrypted: Boolean,
    securityGroups: [String],
    compliance: [String] // e.g., ['PCI DSS', 'ISO 27001']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
virtualMachineSchema.index({ name: 1, hypervisor: 1 });
virtualMachineSchema.index({ 'technical.os.name': 1 });
virtualMachineSchema.index({ 'status.lifecycle': 1 });

// Virtual for uptime (example)
virtualMachineSchema.virtual('uptime').get(function() {
  if (this.status.commissionDate && this.status.lifecycle === 'Active') {
    return Date.now() - this.status.commissionDate;
  }
  return 0;
});

module.exports = mongoose.model('VirtualMachine', virtualMachineSchema);
const express = require('express');
const connectDB = require('./config/db'); // Import the database connection
const dotenv = require('dotenv');

// Import all routes
const assetRoutes = require('./routes/asset');
const authRoutes = require('./routes/auth');

const dataCenterRoutes = require('./routes/datacenter');
const departmentRoutes = require('./routes/department');
const employeeRoutes = require('./routes/employees');
const hypervisorRoutes = require('./routes/hypervisors');
const networkRoutes = require('./routes/networks');
const rackRoutes = require('./routes/racks');
const roleRoutes = require('./routes/role');
const serverRoutes = require('./routes/servers');
const telecomRoutes = require('./routes/telecoms');
const vmRoutes = require('./routes/vms');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());
// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Define routes
app.use('/api/assets', assetRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/datacenters', dataCenterRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/hypervisors', hypervisorRoutes);
app.use('/api/networkdevices', networkRoutes);
app.use('/api/racks', rackRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/telecoms', telecomRoutes);
app.use('/api/vms', vmRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', dbState: mongoose.connection.readyState });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


/*


require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
// console.log('Loaded Environment Variables:', process.env);
const cors = require('cors');
const router = express.Router();
const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

const multer = require('multer');
const xlsx = require('xlsx');
const { body, validationResult } = require('express-validator');

const bodyParser = require('body-parser');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const dotenv = require('dotenv');
// console.log('MongoDB URI:', process.env.MONGO_URI);
dotenv.config();


app.use(bodyParser.json());

app.use('/api/auth', authRoutes);

// Connect to MongoDB
// mongoose.connect('mongodb://127.0.0.1:27017/banking_assets')
//   .then(() => console.log('MongoDB connected successfully'))
//   .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(cors());



// Data Center Schema
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
  tierLevel: { type: String },
  operationalSince: { type: Date },
  maintenanceSchedule: { type: String },
  responsibleTeam: { type: String },
  upstreamDependency: { type: String },
  downstreamDependency: { type: String }
}, { timestamps: true });

const DataCenter = mongoose.model('DataCenter', dataCenterSchema);



const rackSchema = new mongoose.Schema({
  RackID: { type: String, required: true, unique: true }, // Uniqueness enforced
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

const Rack = mongoose.model('Rack', rackSchema);



const telecomSchema = new mongoose.Schema({
  ciID: { type: String, required: true, unique: true },
  providerName: { type: String, required: true }, // e.g., Ethio Telecom
  serviceType: { type: String, required: true }, // e.g., Internet, MPLS
  bandwidth: { type: String }, // e.g., 100 Mbps
  startPoint: { type: String, required: true }, // e.g., Data Center
  endPoint: { type: String, required: true }, // e.g., Branch
  ipRange: { type: String }, // e.g., Public/Private IP
  vlanID: { type: String }, // If applicable
  technologyUsed: { type: String }, // e.g., Fiber
  routerSwitchEndpoint: { type: String }, // CI ID of the device
  linkStatus: { type: String, enum: ['Active', 'Inactive', 'Degraded'], required: true },
  commissionedDate: { type: Date, required: true },
  contractExpiry: { type: Date },
  supportContact: { type: String },
  monitoringTool: { type: String }, // e.g., Pingdom
  slaAgreement: { type: String }, // e.g., 99.5%
  downstreamDependencies: { type: String }, // e.g., Branches
  upstreamDependencies: { type: String }, // e.g., Data Center
  responsibleTeam: { type: String, required: true } // e.g., Telecom Team
}, { timestamps: true });

const Telecom = mongoose.model('Telecom', telecomSchema);



// Department Schema
const departmentSchema = new mongoose.Schema({
  UnitID: { type: String, required: true, unique: true }, // Ensure this is correct
  unitName: { type: String, required: true },
  divisionName: { type: String, required: true },
  description: String
}, { timestamps: true });

const Department = mongoose.model('Department', departmentSchema);



// Role Schema
const roleSchema = new mongoose.Schema({
   roleId: { type: String, required: true, unique: true },
   roleName: { type: String, required: true },
  grade: { type: String, required: true },
  category: { type: String, required: true }
}, { timestamps: true });

const Role = mongoose.model('Role', roleSchema);




// Asset Schema
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

const Asset = mongoose.model('Asset', assetSchema);






// API Endpoints for Assets
app.get('/api/assets', async (req, res) => {
  try {
    const assets = await Asset.find().sort({ createdAt: -1 });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/assets', async (req, res) => {
  try {
    const asset = new Asset(req.body);
    await asset.save();
    res.status(201).json(asset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/assets/:id', async (req, res) => {
  try {
    const updatedAsset = await Asset.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedAsset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/assets/:id', async (req, res) => {
  try {
    await Asset.findByIdAndDelete(req.params.id);
    res.json({ message: 'Asset deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// API Endpoints for Data Centers

app.post('/api/datacenters', async (req, res) => {
  try {
    const dataCenter = new DataCenter(req.body);
    await dataCenter.save();
    res.status(201).json(dataCenter);
  } catch (err) {
    if (err.code === 11000) { // Duplicate key error code
      return res.status(400).json({ error: 'DCCode must be unique' });
    }
    res.status(400).json({ error: err.message });
  }
});


router.get('/api/datacenters', async (req, res) => {
  try {
    const dc = await DataCenter.find().sort({ createdAt: -1 });
    res.json(dc);
  } catch (err) {
    console.error('Error fetching dc:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get telecoms count
router.get('/api/datacenters/count', async (req, res) => {
  try {
    const count = await Telecom.countDocuments(); // Adjust based on your model
    res.json({ count });
  } catch (error) {
    console.error('Error fetching dc count:', error);
    res.status(500).json({ error: 'Failed to fetch dc count' });
  }
});



app.put('/api/datacenters/:id', async (req, res) => {
  try {
    const updatedDataCenter = await DataCenter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedDataCenter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/datacenters/:id', async (req, res) => {
  try {
    await DataCenter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Data Center deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// API Endpoints for Departments
app.get('/api/departments', async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/api/departments', async (req, res) => {
  console.log("Request body:", req.body);

  try {
    const department = new Department(req.body);
    await department.save();
    res.status(201).json(department);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/departments/:id', async (req, res) => {
  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedDepartment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/departments/:id', async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// API Endpoints for Roles
app.get('/api/roles', async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/roles', async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();
    res.status(201).json(role);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/roles/:id', async (req, res) => {
  try {
    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedRole);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/roles/:id', async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.id);
    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// In your backend (e.g., server.js or racksController.js)
router.get('/api/racks/count', async (req, res) => {
  try {
    const count = await Rack.countDocuments(); // Adjust based on your model
    res.json({ count });
     res.json(count);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rack count' });
  }
});

module.exports = router;
app.get('/api/racks', async (req, res) => {
  try {
    const racks = await Rack.find().populate('dataCenterID').sort({ createdAt: -1 });
    console.log('Racks with populated data centers:', racks); // Debugging line
    res.json(racks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/racks', async (req, res) => {
  console.log("Received rack data:", req.body);
  try {
    const rack = new Rack(req.body);
    await rack.save();
    res.status(201).json(rack);
  } 
  catch (err) {
    if (err.code === 11000) { // Duplicate key error code
      return res.status(400).json({ error: 'RackID must be unique' });
    }
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/racks/:id', async (req, res) => {
  try {
    const updatedRack = await Rack.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedRack);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/racks/:id', async (req, res) => {
  try {
    await Rack.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rack deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// API Endpoints for Telecom Infrastructure
router.get('/api/telecoms', async (req, res) => {
  try {
    const telecoms = await Telecom.find().sort({ createdAt: -1 });
    res.json(telecoms);
  } catch (err) {
    console.error('Error fetching telecoms:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  }
});

// Get telecoms count
router.get('/api/telecoms/count', async (req, res) => {
  try {
    const count = await Telecom.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error fetching telecoms count:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to fetch telecoms count' });
    }
  }
});



app.post('/api/telecoms', async (req, res) => {
  try {
    const telecom = new Telecom(req.body);
    await telecom.save();
    res.status(201).json(telecom);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/telecoms/:id', async (req, res) => {
  try {
    const updatedTelecom = await Telecom.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTelecom);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/telecoms/:id', async (req, res) => {
  try {
    await Telecom.findByIdAndDelete(req.params.id);
    res.json({ message: 'Telecom record deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});





// Network Device Schema
const networkDeviceSchema = new mongoose.Schema({
  ciClass: { type: String, default: 'Network Device' },
  ciSubClass: { 
    type: String, 
    required: true,
    enum: ['Router', 'Switch', 'Firewall', 'Load Balancer', 'Wireless Controller'] 
  },
  ciID: { type: String, required: true, unique: true },
  deviceName: { type: String, required: true },
  deviceType: { 
    type: String, 
    required: true,
    enum: ['Layer 2 Switch', 'Layer 3 Router', 'NGFW', 'Load Balancer', 'Wireless Controller'] 
  },
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
  securityZone: { 
    type: String, 
    enum: ['DMZ', 'Internal', 'External', 'Management'] 
  },
  redundancy: { 
    type: String, 
    enum: ['Yes', 'No'] 
  },
  powerSource: { 
    type: String, 
    enum: ['Main', 'UPS', 'Dual-Power'] 
  },
  commissionedDate: Date,
  firmwareLastUpdated: Date,
  sla: String,
  monitoringTool: String,
  responsibleTeam: String,
  changeHistoryRef: String,
  notes: String
}, { timestamps: true });

const NetworkDevice = mongoose.model('NetworkDevice', networkDeviceSchema);

// API Endpoints for Network Devices
app.get('/api/network-devices', async (req, res) => {
  try {
    const devices = await NetworkDevice.find().sort({ createdAt: -1 });
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/network-devices', async (req, res) => {
  try {
    const device = new NetworkDevice(req.body);
    await device.save();
    res.status(201).json(device);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      const message = `${field === 'ciID' ? 'CI ID' : 'Serial Number'} must be unique`;
      return res.status(400).json({ error: message });
    }
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/network-devices/:id', async (req, res) => {
  try {
    const updatedDevice = await NetworkDevice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedDevice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/network-devices/:id', async (req, res) => {
  try {
    await NetworkDevice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Network device deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Count endpoint for dashboard
router.get('/api/network-devices/count', async (req, res) => {
  try {
    const count = await NetworkDevice.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch device count' });
  }
});






const hypervisorSchema = new mongoose.Schema({
  ciId: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^HV-\d{3}$/ 
  },
  name: { 
    type: String, 
    required: true,
    index: true
  },
  type: { 
    type: String, 
    required: true,
    enum: ['VMware ESXi', 'Microsoft Hyper-V', 'KVM', 'Proxmox', 'Xen']
  },
  version: { type: String, required: true },
  managementIp: { 
    type: String,
    match: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  },
  hostServer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'PhysicalServer' 
  },
  cluster: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'VMCluster' 
  },
  status: { 
    type: String, 
    required: true,
    enum: ['Active', 'Maintenance', 'Retired'],
    default: 'Active'
  },
  commissionDate: Date,
  notes: String,
  vms: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'VirtualMachine' 
  }],
  capacity: {
    cpuCores: Number,
    totalRAM: Number,  // in GB
    storage: Number    // in GB
  },
  utilization: {
    cpuUsage: Number,  // percentage
    ramUsage: Number,  // percentage
    storageUsage: Number // percentage
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true } 
});

// Virtual for VM count
hypervisorSchema.virtual('vmCount').get(function() {
  return this.vms ? this.vms.length : 0;
});

module.exports = mongoose.model('Hypervisor', hypervisorSchema);






const vmClusterSchema = new mongoose.Schema({
  clusterId: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^CL-\d{3}$/ 
  },
  name: { 
    type: String, 
    required: true,
    index: true
  },
  type: { 
    type: String, 
    required: true,
    enum: ['vSphere', 'Hyper-V', 'KVM', 'Proxmox']
  },
  description: String,
  features: {
    haEnabled: { type: Boolean, default: false },
    drEnabled: { type: Boolean, default: false },
    ftEnabled: { type: Boolean, default: false }
  },
  status: { 
    type: String, 
    required: true,
    enum: ['Active', 'Standby', 'Maintenance'],
    default: 'Active'
  },
  hypervisors: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hypervisor' 
  }],
  virtualMachines: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'VirtualMachine' 
  }],
  resourcePool: {
    cpuLimit: Number,    // in MHz
    memoryLimit: Number, // in GB
    storageLimit: Number // in GB
  },
  networking: {
    vSwitch: String,
    portGroup: String,
    vlanId: Number
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true } 
});

// Virtuals for counts
vmClusterSchema.virtual('hypervisorCount').get(function() {
  return this.hypervisors ? this.hypervisors.length : 0;
});

vmClusterSchema.virtual('vmCount').get(function() {
  return this.virtualMachines ? this.virtualMachines.length : 0;
});

module.exports = mongoose.model('VMCluster', vmClusterSchema);





const virtualMachineSchema = new mongoose.Schema({
  ciId: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^VM-\d{4}$/ 
  },
  name: { 
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



// Hypervisor Endpoints
router.post('/hypervisors', async (req, res) => {
  try {
    const hypervisor = new Hypervisor(req.body);
    await hypervisor.save();
    res.status(201).json(hypervisor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/hypervisors', async (req, res) => {
  try {
    const hypervisors = await Hypervisor.find()
      .populate('hostServer', 'name ciId')
      .populate('cluster', 'name clusterId')
      .populate('vms', 'name ciId status');
    res.json(hypervisors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/hypervisors/:id', async (req, res) => {
  try {
    const hypervisor = await Hypervisor.findById(req.params.id)
      .populate('hostServer')
      .populate('cluster')
      .populate('vms');
    if (!hypervisor) return res.status(404).json({ error: 'Hypervisor not found' });
    res.json(hypervisor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// VM Cluster Endpoints
router.post('/clusters', async (req, res) => {
  try {
    const cluster = new VMCluster(req.body);
    await cluster.save();
    res.status(201).json(cluster);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/clusters', async (req, res) => {
  try {
    const clusters = await VMCluster.find()
      .populate('hypervisors', 'name ciId status')
      .populate('virtualMachines', 'name ciId status');
    res.json(clusters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Virtual Machine Endpoints
router.post('/vms', async (req, res) => {
  try {
    const vm = new VirtualMachine(req.body);
    await vm.save();
    
    // Add VM to hypervisor
    await Hypervisor.findByIdAndUpdate(
      vm.hypervisor,
      { $addToSet: { vms: vm._id } }
    );
    
    // Add VM to cluster if exists
    if (vm.cluster) {
      await VMCluster.findByIdAndUpdate(
        vm.cluster,
        { $addToSet: { virtualMachines: vm._id } }
      );
    }
    
    res.status(201).json(vm);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/vms', async (req, res) => {
  try {
    const { hypervisor, cluster, status } = req.query;
    const filter = {};
    
    if (hypervisor) filter.hypervisor = hypervisor;
    if (cluster) filter.cluster = cluster;
    if (status) filter['status.lifecycle'] = status;
    
    const vms = await VirtualMachine.find(filter)
      .populate('hypervisor', 'name ciId')
      .populate('cluster', 'name clusterId');
      
    res.json(vms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update VM Status
router.patch('/vms/:id/status', async (req, res) => {
  try {
    const { lifecycle } = req.body;
    if (!['Active', 'In Maintenance', 'Retired'].includes(lifecycle)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const update = { 'status.lifecycle': lifecycle };
    if (lifecycle === 'Retired') {
      update['status.decommissionDate'] = new Date();
    }
    
    const vm = await VirtualMachine.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true }
    );
    
    if (!vm) return res.status(404).json({ error: 'VM not found' });
    res.json(vm);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get VM Utilization Metrics
router.get('/vms/:id/metrics', async (req, res) => {
  try {
    const vm = await VirtualMachine.findById(req.params.id)
      .select('technical status monitoring');
      
    if (!vm) return res.status(404).json({ error: 'VM not found' });
    
    // In real implementation, fetch from monitoring system
    const metrics = {
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 100,
      diskUsage: Math.random() * 100,
      networkIn: Math.random() * 1000,
      networkOut: Math.random() * 1000,
      lastUpdated: new Date()
    };
    
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





const serverRegistrationSchema = new mongoose.Schema({
  ciId: {
    type: String,
    required: true,
  },
  ciName: {
    type: String,
    required: true,
  },
  hostname: {
    type: String,
    required: true,
  },
  ciType: {
    type: String,
    enum: ['Rack Server', 'Blade Server', 'Tower Server', 'Mainframe'],
    required: true,
  },
  manufacturer: {
    type: String,
    enum: ['Dell', 'HPE', 'Lenovo', 'IBM', 'Huawei', 'Cisco', 'Supermicro'],
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  serialNumber: {
    type: String,
    required: true,
  },
  assetTag: {
    type: String,
    required: true,
  },
  ownerDepartment: {
    type: String,
    enum: ['Infrastructure', 'Data Center', 'IT Operations', 'Application Development', 'Database Administration'],
    required: true,
  },
  primaryOwner: {
    type: String,
    required: true,
  },
  primaryContact: {
    type: String,
    required: true,
  },
  secondaryOwner: {
    type: String,
  },
  secondaryContact: {
    type: String,
  },
  supportVendor: {
    type: String,
  },
  dataCenter: {
    type: String,
    enum: ['DC1', 'DC2', 'DR Site', 'Branch Office'],
    required: true,
  },
  rackId: {
    type: String,
    required: true,
  },
  rackPosition: {
    type: String,
    required: true,
  },
  roomFloor: {
    type: String,
    required: true,
  },
  geoCoordinates: {
    type: String,
    required: true,
  },
  cpuType: {
    type: String,
    required: true,
  },
  cpuSockets: {
    type: Number,
    required: true,
  },
  coresPerCpu: {
    type: Number,
    required: true,
  },
  logicalProcessors: {
    type: Number,
    required: true,
  },
  ramCapacity: {
    type: String,
    required: true,
  },
  storageCapacity: {
    type: String,
    required: true,
  },
  raidConfig: {
    type: String,
    required: true,
  },
  powerSupplies: {
    type: String,
    required: true,
  },
  os: {
    type: String,
    enum: ['Windows Server 2022', 'RHEL 9', 'Ubuntu Server 22.04', 'SUSE Linux Enterprise Server', 'VMware ESXi'],
    required: true,
  },
  osLicense: {
    type: String,
    required: true,
  },
  firmwareVersion: {
    type: String,
    required: true,
  },
  nics: {
    type: Number,
    required: true,
  },
  nicSpeed: {
    type: String,
    enum: ['1GbE', '10GbE', '25GbE', '40GbE', '100GbE'],
  },
  clusterMembership: {
    type: String,
    enum: ['No', 'Yes'],
  },
  clusterName: {
    type: String,
  },
  upstreamDependencies: {
    type: String,
  },
  downstreamDependencies: {
    type: String,
  },
  associatedServices: {
    type: String,
  },
  businessCriticality: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    required: true,
  },
  serviceImpact: {
    type: String,
  },
  riskRating: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    required: true,
  },
  licenseType: {
    type: String,
    enum: ['OEM', 'Volume License', 'Subscription'],
    required: true,
  },
  licenseExpiry: {
    type: Date,
  },
  supportContract: {
    type: String,
    enum: ['No', 'Yes'],
  },
  contractExpiry: {
    type: Date,
  },
  complianceRequirements: {
    type: String,
  },
  monitoringTool: {
    type: String,
  },
  lastMaintenance: {
    type: Date,
  },
  nextMaintenance: {
    type: Date,
  },
  firmwareHistory: {
    type: String,
  },
  incidentHistory: {
    type: String,
  },
  lifecycleStatus: {
    type: String,
    enum: ['Planned', 'Active', 'In Maintenance', 'Retired'],
    required: true,
  },
  commissionDate: {
    type: Date,
  },
  decommissionDate: {
    type: Date,
  },
  addedToCmdb: {
    type: Date,
  },
  lastUpdated: {
    type: Date,
  },
}, {
  timestamps: true // Automatically manage createdAt and updatedAt fields
});

// Create the model
const ServerRegistration = mongoose.model('ServerRegistration', serverRegistrationSchema);

module.exports = ServerRegistration;






// MongoDB Schema

// const employeeSchema = new mongoose.Schema({
//   EMP_ID: { type: String, required: true, unique: true },
//   EMP_NAME: { type: String, required: true },
//   EMAIL_ADDRESS: { type: String, required: true },
//   SUPERVISOR_NAME: String,
//   STATUS: String,
//   UNIT_NAME: String,
//   ROLE: String,
//   POSITION: String,
//   GRADE: String,
//   JOBCAT: String,
//   SALARY: Number,
//   SECTOR: String,
//   DIVISION: String,
//   DEPARTMENT: String
// }, { timestamps: true });

// const Employee = mongoose.model('Employee', employeeSchema, 'employee_information');

// Memory storage for files
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Upload endpoint - FIXED
app.post('/api/employees/upload', upload.single('excelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (!data.length) {
      return res.status(400).json({ message: 'Excel file contains no data' });
    }

    // Transform data
    const employees = data.map(row => ({
      EMP_ID: row.EMP_ID || row['Employee ID'],
      EMP_NAME: row.EMP_NAME || row['Employee Name'],
      EMAIL_ADDRESS: row.EMAIL_ADDRESS || row['Email Address'],
      SUPERVISOR_NAME: row.SUPERVISOR_NAME || row['Supervisor Name'],
      STATUS: row.STATUS || row.Status,
      UNIT_NAME: row.UNIT_NAME || row['Unit Name'],
      ROLE: row.ROLE || row.Role,
      POSITION: row.POSITION || row.Position,
      GRADE: row.GRADE || row.Grade,
      JOBCAT: row.JOBCAT || row.JobCategory,
      SALARY: row.SALARY || row.Salary,
      SECTOR: row.SECTOR || row.Sector,
      DIVISION: row.DIVISION || row.Division,
      DEPARTMENT: row.DEPARTMENT || row.Department
    }));

    // Batch insert
    const result = await Employee.insertMany(employees, {
      ordered: false,
      rawResult: true
    });

    const insertedCount = result.insertedCount;
    const errors = result.writeErrors || [];

    res.status(201).json({ 
      message: `Upload successful. Inserted: ${insertedCount}, Errors: ${errors.length}`,
      details: errors.map(e => e.errmsg)
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    let message = 'Server error';
    if (error.name === 'ValidationError') {
      message = 'Data validation failed';
    } else if (error.code === 11000) {
      message = 'Duplicate employee ID found';
    }
    
    res.status(500).json({ 
      message,
      error: error.message 
    });
  }
});

// Other endpoints (CRUD operations)...
// API Endpoints for Employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    // Create new employee from request body
    const employee = new Employee(req.body);
    
    // Validate required fields
    if (!employee.EMP_ID || !employee.EMP_NAME || !employee.EMAIL_ADDRESS) {
      return res.status(400).json({ error: 'EMP_ID, EMP_NAME, and EMAIL_ADDRESS are required' });
    }
    
    // Check for duplicate EMP_ID
    const existingEmployee = await Employee.findOne({ EMP_ID: employee.EMP_ID });
    if (existingEmployee) {
      return res.status(409).json({ error: `Employee with ID ${employee.EMP_ID} already exists` });
    }
    
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ 
      error: err.message,
      // Add more details for validation errors
      ...(err.name === 'ValidationError' && { details: err.errors }) 
    });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    // Prevent EMP_ID modification
    if (req.body.EMP_ID) {
      return res.status(400).json({ error: 'EMP_ID cannot be modified' });
    }
    
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(updatedEmployee);
  } catch (err) {
    res.status(400).json({ 
      error: err.message,
      ...(err.name === 'ValidationError' && { details: err.errors })
    });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    
    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json({ 
      message: 'Employee deleted successfully',
      deletedId: deletedEmployee._id,
      empName: deletedEmployee.EMP_NAME
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    dbState: mongoose.connection.readyState 
  });
});






// // User Schema (users collection)
// const userSchema = new mongoose.Schema({
//   empId: {
//     type: String,
//     required: true,
//     unique: true,
//     index: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   department: {
//     type: String,
//     required: true
//   },
//   password: {
//     type: String,
//     required: true,
//     select: false
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// }, { collection: 'users' });

// Password hashing middleware for users
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
  
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// // Password comparison method
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// const User = mongoose.model('User', userSchema);

// Department list endpoint
app.get('/api/departments', async (req, res) => {
  try {
    const departments = await Employee.distinct('DEPARTMENT');
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Signup endpoint
app.post('/api/auth/signup', async (req, res) => {
  const { empId, email, department } = req.body;
  
  try {
    // 1. Verify employee exists
    const employee = await Employee.findOne({
      EMP_ID: empId,
      EMAIL_ADDRESS: email,
      DEPARTMENT: department
    });
    
    if (!employee) {
      return res.status(404).json({
        message: 'Employee verification failed. Please check your details.'
      });
    }
    
    // 2. Check if user already exists
    const existingUser = await User.findOne({ empId });
    if (existingUser) {
      return res.status(400).json({
        message: 'Account already exists. Please sign in.'
      });
    }
    
    // 3. Create user with default password
    const defaultPassword = 'CBE@1234';
    const newUser = new User({
      empId,
      email,
      department,
      password: defaultPassword
    });
    
    await newUser.save();
    
    res.status(201).json({
      message: `Account created successfully! Your default password is: ${defaultPassword}`
    });
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { empId, password, rememberMe } = req.body;
  
  try {
    // 1. Find user by employee ID
    const user = await User.findOne({ empId }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        message: 'No account found. Please sign up first.'
      });
    }
    
    // 2. Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }
    
    // 3. Create JWT token
    const token = jwt.sign(
      { id: user._id, empId: user.empId },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? '7d' : '8h' }
    );
    
    // 4. Return user data without password
    const userData = user.toObject();
    delete userData.password;
    
    res.json({
      message: 'Login successful',
      token,
      user: userData
    });
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

 
});

 */


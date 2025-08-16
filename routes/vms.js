const express = require('express');
const router = express.Router();
const VirtualMachine = require('../models/VirtualMachine');

// Get all VMs
router.get('/', async (req, res) => {
  try {
    const { hypervisor, cluster, status } = req.query;
    const filter = {};
    
    if (hypervisor) filter.hypervisor = hypervisor;
    if (cluster) filter.cluster = cluster;
    if (status) filter['status.lifecycle'] = status;

    const vms = await VirtualMachine.find(filter).populate('hypervisor', 'name ciId').populate('cluster', 'name clusterId');
    res.json(vms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new VM
router.post('/', async (req, res) => {
  try {
    const vm = new VirtualMachine(req.body);
    await vm.save();
    res.status(201).json(vm);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a VM
router.put('/:id', async (req, res) => {
  try {
    const updatedVM = await VirtualMachine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedVM);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a VM
router.delete('/:id', async (req, res) => {
  try {
    await VirtualMachine.findByIdAndDelete(req.params.id);
    res.json({ message: 'VM deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update VM status
router.patch('/:id/status', async (req, res) => {
  try {
    const { lifecycle } = req.body;
    if (!['Active', 'In Maintenance', 'Retired'].includes(lifecycle)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const update = { 'status.lifecycle': lifecycle };
    if (lifecycle === 'Retired') {
      update['status.decommissionDate'] = new Date();
    }

    const vm = await VirtualMachine.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!vm) return res.status(404).json({ error: 'VM not found' });
    res.json(vm);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get VM utilization metrics
router.get('/:id/metrics', async (req, res) => {
  try {
    const vm = await VirtualMachine.findById(req.params.id).select('technical status monitoring');
    if (!vm) return res.status(404).json({ error: 'VM not found' });

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

module.exports = router;
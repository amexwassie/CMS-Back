const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');

// Get all assets
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.find().sort({ createdAt: -1 });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new asset
router.post('/', async (req, res) => {
  try {
    const asset = new Asset(req.body);
    await asset.save();
    res.status(201).json(asset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update an asset
router.put('/:id', async (req, res) => {
  try {
    const updatedAsset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedAsset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an asset
router.delete('/:id', async (req, res) => {
  try {
    await Asset.findByIdAndDelete(req.params.id);
    res.json({ message: 'Asset deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
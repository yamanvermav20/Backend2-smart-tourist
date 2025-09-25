const express = require('express');
const auth = require('../middleware/auth');
const Zone = require('../models/Zone');
const router = express.Router();

// GET /api/zones/safe - List all safe zones only
router.get('/safe', auth(), async (req, res) => {
  try {
    const safeZones = await Zone.find({ type: 'safe' });
    res.json(safeZones);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
// POST /api/zones - Create a new geo-fenced area
router.post('/', auth(), async (req, res) => {
  try {
    const { name, description, coordinates, type } = req.body;
    if (!name || !type) return res.status(400).json({ message: 'Name and type are required' });
    const zone = await Zone.create({ name, type, description, coordinates });
    res.status(201).json(zone);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// (Optional) GET /api/zones - List all zones
router.get('/', auth(), async (req, res) => {
  try {
    const zones = await Zone.find();
    res.json(zones);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

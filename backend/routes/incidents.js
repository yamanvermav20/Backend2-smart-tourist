const express = require('express');
const auth = require('../middleware/auth');
const SOSEmergency = require('../models/SOSEmergency');
const Zone = require('../models/Zone');
const router = express.Router();

// POST /api/incidents/sos post karega sos 
router.post('/sos', auth(), async (req, res) => {
  try {
    let { latitude, longitude, message } = req.body;
    latitude = Number(latitude);
    longitude = Number(longitude);
    // Debug: log received values
    // console.log('Received SOS:', latitude, longitude, message);
    if (
      typeof latitude !== 'number' ||
      typeof longitude !== 'number' ||
      isNaN(latitude) ||
      isNaN(longitude) ||
      !message
    ) {
      return res.status(400).json({ message: 'Latitude, longitude, and message required' });
    }

    const allZones = await Zone.find();
    let foundZone = null;
    for (const zone of allZones) {
      if (Array.isArray(zone.coordinates) && zone.coordinates.length) {
        for (const coord of zone.coordinates) {
          if (
            Math.abs(coord[0] - latitude) < 0.001 &&
            Math.abs(coord[1] - longitude) < 0.001
          ) {
            foundZone = zone;
            break;
          }
        }
      }
      if (foundZone) break;
    }
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    const sosEmergency = new SOSEmergency({
      userId: req.user.id,
      userName: user ? user.name : '',
      userPhone: user ? user.phone : '',
      zoneId: foundZone ? foundZone._id : null,
      latitude,
      longitude,
      priority: 'HIGH',
      status: 'pending',
      message
    });
    await sosEmergency.save();
    res.status(201).json({ message: 'SOS emergency reported successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// GET /api/incidents/sos/count - Get karega sos ka count
router.get('/sos/count', auth(), async (req, res) => {
  try {
    const count = await SOSEmergency.countDocuments({ userId: req.user.id });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/incidents/sos/all - Get karega sos ko
router.get('/sos/all', auth('admin'), async (req, res) => {
  try {
    const allSOS = await SOSEmergency.find().sort({ createdAt: -1 }); // latest first
    res.json(allSOS);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;

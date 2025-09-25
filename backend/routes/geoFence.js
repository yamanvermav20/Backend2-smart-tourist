const express = require('express');
const auth = require('../middleware/auth');
const LocationHistory = require('../models/LocationHistory');  
const Zone = require('../models/Zone');
const router = express.Router();

// POST /api/geo-fence - Check zone and log location
router.post('/', auth(), async (req, res) => {
  try {
    const { zoneId } = req.body;
    if (!zoneId) return res.status(400).json({ message: 'Zone ID required' });
    const zone = await Zone.findById(zoneId);
    if (!zone) return res.status(404).json({ message: 'Zone not found' });
    // Log location history
    await LocationHistory.create({ userId: req.user.id, zoneId: zone._id });
    if (zone.type === 'danger') {
      return res.json({ status: 'danger', message: 'Danger zone! Incident auto-created.' });
    }
    res.json({ status: 'safe', message: 'Zone is safe.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/geo-fence/user-zones - All zones geo-fenced by user
router.get('/user-zones', auth(), async (req, res) => {
  try {
    const history = await LocationHistory.find({ userId: req.user.id }).populate('zoneId');
    const result = history.map(h => ({
      zoneName: h.zoneId?.name || h.zoneId,
      zoneType: h.zoneId?.type || '',
      timestamp: h.timestamp
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

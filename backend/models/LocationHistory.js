const mongoose = require('mongoose');

const locationHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  zoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone', required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LocationHistory', locationHistorySchema);
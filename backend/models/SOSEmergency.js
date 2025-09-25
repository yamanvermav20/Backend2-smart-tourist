const mongoose = require('mongoose');

const sosEmergencySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String },
  userPhone: { type: String },
  zoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone' }, // optional
  latitude: { type: Number },
  longitude: { type: Number },
  priority: { type: String, enum: ['HIGH', 'MEDIUM'], required: true },
  status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
  message: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SOSEmergency', sosEmergencySchema, 'sosemergencies');

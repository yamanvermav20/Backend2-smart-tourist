const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['safe', 'danger'], required: true },
  description: { type: String },
  coordinates: { type: [[Number]], default: [] }
});

module.exports = mongoose.model('Zone', zoneSchema);
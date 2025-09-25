const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: null },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'tourist'], required: true },
  emergencyContacts: [{ name: String, phone: String }]
});

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // running, cycling, strength, etc.
  duration: { type: Number, required: true }, // in minutes
  calories: { type: Number, required: true },
  date: { type: Date, required: true },
  distance: Number, // in km
  notes: String,
  intensity: { type: String, enum: ['Low', 'Moderate', 'High'] }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
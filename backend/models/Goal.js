const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  category: { type: String, required: true }, // fitness, wellness, nutrition
  targetMetric: { type: String, required: true }, // kg, minutes, steps, etc.
  targetValue: { type: Number, required: true },
  currentValue: { type: Number, default: 0 },
  progress: { type: Number, default: 0 }, // percentage
  targetDate: Date,
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  milestones: [String]
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
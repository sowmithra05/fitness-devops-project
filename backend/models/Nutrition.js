const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
  foodItems: [{
    name: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  }],
  totalCalories: Number,
  waterIntake: { type: Number, default: 0 } // in glasses
}, { timestamps: true });

module.exports = mongoose.model('Nutrition', nutritionSchema);
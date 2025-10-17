const express = require('express');
const auth = require('../middleware/auth');
const Nutrition = require('../models/Nutrition');
const Goal = require('../models/Goal');

const router = express.Router();

// Get nutrition data for date range
router.get('/', auth, async (req, res) => {
  try {
    const { date } = req.query;
    const nutrition = await Nutrition.find({
      userId: req.user.userId,
      date: new Date(date)
    });
    
    res.json(nutrition);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create nutrition entry
router.post('/', auth, async (req, res) => {
  try {
    const nutrition = new Nutrition({
      userId: req.user.userId,
      ...req.body
    });
    
    await nutrition.save();
    res.status(201).json(nutrition);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get goals
router.get('/goals', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.userId });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create goal
router.post('/goals', auth, async (req, res) => {
  try {
    const goal = new Goal({
      userId: req.user.userId,
      ...req.body
    });
    
    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update goal
router.put('/goals/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: req.body },
      { new: true }
    );
    
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete goal
router.delete('/goals/:id', auth, async (req, res) => {
  try {
    await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
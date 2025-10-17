const express = require('express');
const auth = require('../middleware/auth');
const Activity = require('../models/Activity');
const Goal = require('../models/Goal');

const router = express.Router();

// Get all activities for user
router.get('/', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user.userId })
      .sort({ date: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create activity
router.post('/', auth, async (req, res) => {
  try {
    const activity = new Activity({
      userId: req.user.userId,
      ...req.body
    });
    
    await activity.save();
    
    // Update relevant goals
    await updateGoalsProgress(req.user.userId);
    
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update activity
router.put('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: req.body },
      { new: true }
    );
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    await updateGoalsProgress(req.user.userId);
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete activity
router.delete('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    await updateGoalsProgress(req.user.userId);
    res.json({ message: 'Activity deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update goals progress based on activities
async function updateGoalsProgress(userId) {
  try {
    const goals = await Goal.find({ userId, status: 'active' });
    
    for (let goal of goals) {
      let currentValue = 0;
      
      if (goal.category === 'fitness') {
        const activities = await Activity.find({ userId });
        
        if (goal.title.includes('Run') || goal.title.includes('run')) {
          currentValue = activities
            .filter(a => a.type === 'running')
            .reduce((sum, a) => sum + (a.distance || 0), 0);
        } else if (goal.title.includes('minutes') || goal.title.includes('Minutes')) {
          currentValue = activities
            .reduce((sum, a) => sum + a.duration, 0);
        }
      }
      
      goal.currentValue = currentValue;
      goal.progress = Math.min(100, (currentValue / goal.targetValue) * 100);
      
      if (goal.progress >= 100) {
        goal.status = 'completed';
      }
      
      await goal.save();
    }
  } catch (error) {
    console.error('Error updating goals:', error);
  }
}

module.exports = router;
const express = require('express');
const router = express.Router();
const FeedingLog = require('../Schemas/FeedingLog');
const Staff = require('../Schemas/staff');
const auth = require('../middleware/auth');

// Get feeding logs for the logged-in staff member's assigned animals or all if admin
router.get('/', auth(), async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      const staffMember = await Staff.findOne({ userId: req.user.id });
      if (!staffMember) {
        return res.status(404).json({ message: 'Staff profile not found' });
      }
      query = { staffId: staffMember._id };
    }
    
    const logs = await FeedingLog.find(query).populate('animalId').populate('staffId').sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching feeding logs: ' + err.message });
  }
});

// Add a new feeding log
router.post('/', auth(), async (req, res) => {
  try {
    const { animalId, foodProvided, quantity, feedingTime, notes } = req.body;
    
    const staffMember = await Staff.findOne({ userId: req.user.id });
    if (!staffMember) {
      return res.status(404).json({ message: 'Staff profile not found' });
    }

    const log = new FeedingLog({
      animalId,
      staffId: staffMember._id,
      foodProvided,
      quantity,
      feedingTime,
      notes
    });

    await log.save();
    res.status(201).json({ message: 'Feeding log added successfully', log });
  } catch (err) {
    res.status(500).json({ message: 'Error creating feeding log: ' + err.message });
  }
});

module.exports = router;

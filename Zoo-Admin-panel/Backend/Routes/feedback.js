const express = require('express');
const router = express.Router();
const Feedback = require('../Schemas/Feedback');

// Submit feedback
router.post('/', async (req, res) => {
  const feedback = new Feedback({
    visitorName: req.body.visitorName,
    rating: req.body.rating,
    comment: req.body.comment
  });

  try {
    const newFeedback = await feedback.save();
    res.status(201).json(newFeedback);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const VisitorInteraction = require('../Schemas/visitors');

// Record a new interaction
router.post('/visitor-interactions', async (req, res) => {
  try {
    const interaction = new VisitorInteraction(req.body);
    await interaction.save();
    res.json({ message: 'Interaction recorded successfully', interaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error recording interaction' });
  }
});

// Get all interactions
router.get('/visitor-interactions', async (req, res) => {
  try {
    const interactions = await VisitorInteraction.find();
    res.json(interactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching interactions' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Enclosure = require('../Schemas/Enclosure');
const auth = require('../middleware/auth');

// Get all enclosures
router.get('/', auth(), async (req, res) => {
    try {
        const enclosures = await Enclosure.find();
        res.json(enclosures);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create enclosure (Admin only)
router.post('/', auth(['admin']), async (req, res) => {
    try {
        const newEnclosure = new Enclosure(req.body);
        await newEnclosure.save();
        res.json(newEnclosure);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

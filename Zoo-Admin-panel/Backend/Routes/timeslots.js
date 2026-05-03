const express = require('express');
const router = express.Router();
const TimeSlot = require('../Schemas/TimeSlot.js');

// Route to add a new time slot
router.post('/add', async (req, res) => {
    try {
        const { date, startTime, endTime, name, phone, status } = req.body;

        // Create a new time slot
        const newSlot = new TimeSlot({
            date,
            startTime,
            endTime,
            name,
            phone,
            status,
        });

        const savedSlot = await newSlot.save();
        res.status(201).json({ message: 'Time slot created successfully', savedSlot });
    } catch (error) {
        res.status(500).json({ message: 'Error creating time slot', error: error.message });
    }
});

// Route to get all time slots
router.get('/all', async (req, res) => {
    try {
        const slots = await TimeSlot.find();
        res.status(200).json({ slots });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching time slots', error: error.message });
    }
});

module.exports = router;

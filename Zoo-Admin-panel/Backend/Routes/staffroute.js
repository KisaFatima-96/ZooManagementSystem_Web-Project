const express = require('express');
const router = express.Router();
const Staff = require('../Schemas/staff');
const auth = require('../middleware/auth');

// Get all staff (Admin only)
router.get('/', auth(['admin']), async (req, res) => {
    try {
        const staff = await Staff.find().populate('userId', 'email name');
        res.json(staff);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create staff (Admin only)
router.post('/', auth(['admin']), async (req, res) => {
    try {
        console.log("POST /api/staff - Body:", req.body);
        
        const { name, role, contact, salary } = req.body;
        
        if (!name || !role) {
            return res.status(400).json({ error: "Name and Role are required" });
        }

        const newStaff = new Staff({
            name,
            role,
            contact,
            salary: Number(salary) || 0
        });

        const savedStaff = await newStaff.save();
        console.log("Staff saved successfully:", savedStaff._id);
        res.status(201).json(savedStaff);
    } catch (err) {
        console.error("FATAL - Staff POST Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Update staff
router.put('/:id', auth(['admin']), async (req, res) => {
    try {
        const { name, role, contact, salary } = req.body;
        const updatedStaff = await Staff.findByIdAndUpdate(
            req.params.id, 
            { name, role, contact, salary: Number(salary) || 0 }, 
            { new: true }
        );
        res.json(updatedStaff);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete staff
router.delete('/:id', auth(['admin']), async (req, res) => {
    try {
        await Staff.findByIdAndDelete(req.params.id);
        res.json({ message: 'Staff deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

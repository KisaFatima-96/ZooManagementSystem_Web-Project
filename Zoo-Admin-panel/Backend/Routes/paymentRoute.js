const express = require('express');
const router = express.Router();
const Payment = require('../Schemas/Payment');
const auth = require('../middleware/auth');

// Get all payments (Admin only)
router.get('/', auth(['admin']), async (req, res) => {
    try {
        const payments = await Payment.find().sort({ date: -1 });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add payment (Admin only)
router.post('/', auth(['admin']), async (req, res) => {
    try {
        const newPayment = new Payment(req.body);
        await newPayment.save();
        res.json(newPayment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

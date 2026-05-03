const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['Expense', 'Income'], default: 'Expense' },
    category: { type: String }, // e.g., Food, Medical, Maintenance
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema);

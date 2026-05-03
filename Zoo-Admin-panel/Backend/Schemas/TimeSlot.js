const mongoose = require('mongoose');

const TimeSlotSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['available', 'full'],
        default: 'available',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('TimeSlot', TimeSlotSchema);

const mongoose = require('mongoose');

const EnclosureSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true }, // e.g., Desert, Rainforest
    capacity: { type: Number, required: true },
    currentAnimals: { type: Number, default: 0 },
    status: { type: String, default: 'Operational' },
    lastCleaned: { type: Date }
});

module.exports = mongoose.model('Enclosure', EnclosureSchema);

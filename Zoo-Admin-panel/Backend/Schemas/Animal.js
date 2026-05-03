const mongoose = require('mongoose');

const AnimalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String },
    enclosure: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assigned staff
    healthStatus: { type: String, default: 'Healthy' },
    diet: { type: String },
    habitat: { type: String },
    lifespan: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Animal', AnimalSchema);
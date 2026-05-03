const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    role: { type: String, required: true },
    contact: { type: String },
    salary: { type: Number },
    hireDate: { type: Date, default: Date.now },
    assignedAnimals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Animal' }]
});

module.exports = mongoose.model('Staff', staffSchema);

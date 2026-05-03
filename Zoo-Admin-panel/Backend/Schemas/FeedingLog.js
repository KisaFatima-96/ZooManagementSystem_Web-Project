const mongoose = require('mongoose');

const feedingLogSchema = new mongoose.Schema({
  animalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  foodProvided: { type: String, required: true },
  quantity: { type: String, required: true },
  feedingTime: { type: Date, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FeedingLog', feedingLogSchema);

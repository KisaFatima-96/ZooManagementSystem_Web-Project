const mongoose = require('mongoose');

const visitorInteractionSchema = new mongoose.Schema({
  visitorName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  details: { type: String, required: true },
  assistanceProvided: { type: Boolean, default: false },
});

module.exports = mongoose.model('VisitorInteraction', visitorInteractionSchema);

const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  visitorName: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: Date, required: true },
  quantity: { type: Number, required: true },
});

module.exports = mongoose.model('Ticket', TicketSchema);
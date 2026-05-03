const express = require('express');
const router = express.Router();
const Ticket = require('../Schemas/Ticket');

// Book a ticket
router.post('/', async (req, res) => {
  const ticket = new Ticket({
    visitorName: req.body.visitorName,
    email: req.body.email,
    date: req.body.date,
    quantity: req.body.quantity
  });

  try {
    const newTicket = await ticket.save();
    res.status(201).json(newTicket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
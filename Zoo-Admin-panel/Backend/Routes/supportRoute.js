const express = require('express');
const router = express.Router();
const SupportRequest = require('../Schemas/SupportRequest');
const Staff = require('../Schemas/staff');
const auth = require('../middleware/auth');

// Get support requests for the logged in user
router.get('/', auth(), async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      const staffMember = await Staff.findOne({ userId: req.user.id });
      if (!staffMember) {
        return res.status(404).json({ message: 'Staff profile not found' });
      }
      query = { staffId: staffMember._id };
    }
    
    const requests = await SupportRequest.find(query).populate('staffId').sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching support requests: ' + err.message });
  }
});

// Add a new support request
router.post('/', auth(), async (req, res) => {
  try {
    const { issueTitle, description } = req.body;
    
    const staffMember = await Staff.findOne({ userId: req.user.id });
    if (!staffMember) {
      return res.status(404).json({ message: 'Staff profile not found' });
    }

    const request = new SupportRequest({
      staffId: staffMember._id,
      issueTitle,
      description
    });

    await request.save();
    res.status(201).json({ message: 'Support request submitted successfully', request });
  } catch (err) {
    res.status(500).json({ message: 'Error creating support request: ' + err.message });
  }
});

// Update support request status
router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const { status } = req.body;
    const request = await SupportRequest.findByIdAndUpdate(req.params.id, { status, updatedAt: Date.now() }, { new: true });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: 'Error updating support request: ' + err.message });
  }
});

module.exports = router;

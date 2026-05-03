const express = require('express');
const router = express.Router();
const Task = require('../Schemas/tasks.js');
const Staff = require('../Schemas/staff.js');
const auth = require('../middleware/auth');

// Assign a new task
router.post('/', async (req, res) => {
  try {
    const { description, assignedTo, dueDate } = req.body;
    // Check if staff member exists
    const staffMember = await Staff.findById(assignedTo);
    if (!staffMember) {
      return res.status(400).json({ message: 'Staff member not found' });
    }

    const task = new Task({ description, assignedTo, dueDate });
    await task.save();
    res.json({ message: 'Task created successfully', task });
  } catch (err) {
    res.status(500).json({ message: 'Error creating task: ' + err.message });
  }
});

// Update task status
router.put('/:taskId', auth(), async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const validStatuses = ['pending', 'in-progress', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, { status }, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task: ' + err.message });
  }
});

// Get all tasks
router.get('/', auth(), async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      const staffMember = await Staff.findOne({ userId: req.user.id });
      if (staffMember) {
        query = { assignedTo: staffMember._id };
      }
    }
    const tasks = await Task.find(query).populate('assignedTo');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks: ' + err.message });
  }
});

module.exports = router;

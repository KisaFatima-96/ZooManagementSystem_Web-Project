const express = require('express');
const router = express.Router();
const Animal = require('../Schemas/Animal');
const auth = require('../middleware/auth');

// Get all animals
router.get('/', auth(), async (req, res) => {
    try {
        const { species, name } = req.query;
        let query = {};
        if (species) query.species = species;
        if (name) query.name = { $regex: name, $options: 'i' };

        const animals = await Animal.find(query);
        res.json(animals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get assigned animals
router.get('/assigned', auth(), async (req, res) => {
    try {
        const Staff = require('../Schemas/staff');
        const staffMember = await Staff.findOne({ userId: req.user.id }).populate('assignedAnimals');
        if (!staffMember) return res.status(404).json({ message: 'Staff profile not found' });
        res.json(staffMember.assignedAnimals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single animal
router.get('/:id', auth(), async (req, res) => {
    try {
        const animal = await Animal.findById(req.params.id);
        if (!animal) return res.status(404).json({ message: 'Animal not found' });
        res.json(animal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create animal (Admin only)
router.post('/', auth(['admin']), async (req, res) => {
    try {
        const newAnimal = new Animal(req.body);
        await newAnimal.save();
        
        if (req.body.assignedTo) {
            const Staff = require('../Schemas/staff');
            await Staff.findByIdAndUpdate(req.body.assignedTo, {
                $addToSet: { assignedAnimals: newAnimal._id }
            });
        }
        
        res.json(newAnimal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update animal (Admin only)
router.put('/:id', auth(['admin']), async (req, res) => {
    try {
        const Staff = require('../Schemas/staff');
        const oldAnimal = await Animal.findById(req.params.id);
        const updatedAnimal = await Animal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (oldAnimal && oldAnimal.assignedTo && oldAnimal.assignedTo.toString() !== req.body.assignedTo) {
            // Remove from old staff
            await Staff.findByIdAndUpdate(oldAnimal.assignedTo, {
                $pull: { assignedAnimals: updatedAnimal._id }
            });
        }
        
        if (req.body.assignedTo) {
            // Add to new staff
            await Staff.findByIdAndUpdate(req.body.assignedTo, {
                $addToSet: { assignedAnimals: updatedAnimal._id }
            });
        }

        res.json(updatedAnimal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete animal (Admin only)
router.delete('/:id', auth(['admin']), async (req, res) => {
    try {
        await Animal.findByIdAndDelete(req.params.id);
        res.json({ message: 'Animal deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Document = require('../Schemas/Document');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Local Storage Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/documents';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Get all documents
router.get('/', auth(), async (req, res) => {
    try {
        const documents = await Document.find();
        res.json(documents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Upload document (Local Storage)
router.post('/upload', auth(['admin']), upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const newDoc = new Document({
            title: req.body.title || req.file.originalname,
            url: `/uploads/documents/${req.file.filename}`,
            public_id: req.file.filename,
            uploadedBy: req.user.id
        });
        await newDoc.save();
        res.json(newDoc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete document
router.delete('/:id', auth(['admin']), async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Document not found' });

        // Remove from file system
        const filePath = path.join(__dirname, '..', doc.url);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Document.findByIdAndDelete(req.params.id);
        res.json({ message: 'Document deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

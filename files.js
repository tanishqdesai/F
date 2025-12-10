const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const File = require('../models/File');
const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.pdf', '.mp4'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only .pdf and .mp4 files are allowed'));
    }
};


const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

// Upload file
router.post('/upload', auth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const file = new File({
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            privacy: req.body.privacy,
            uploadedBy: req.user._id,
            shareableId: uuidv4()
        });

        await file.save();
        res.json({ message: 'File uploaded successfully', file });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's files
router.get('/my-files', auth, async (req, res) => {
    try {
        const files = await File.find({ uploadedBy: req.user._id })
            .sort({ uploadedAt: -1 });
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get public files
router.get('/public-files', async (req, res) => {
    try {
        const files = await File.find({ privacy: 'public' })
            .sort({ uploadedAt: -1 })
            .populate('uploadedBy', 'username');
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Download file
router.get('/:id/download', async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

    // Check if file is public or user has access
        if (file.privacy === 'private') {
            // For simplicity, download with shareableId
            if (req.query.token !== file.shareableId) {
                return res.status(403).json({ error: 'Access denied' });
            }
        }

        res.download(file.path, file.originalName);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

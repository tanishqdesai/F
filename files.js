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

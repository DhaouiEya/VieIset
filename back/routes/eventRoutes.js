const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getEvents,
  getEvent,
  createEvent,
  registerStudent
} = require('../controllers/eventController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'), false);
    }
  }
});

router.get('/', getEvents);                  // GET /api/events
router.get('/:id', getEvent);                // GET /api/events/:id
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }]), createEvent);
              // POST /api/events
router.post('/:id/register', registerStudent); // POST /api/events/:id/register

module.exports = router;

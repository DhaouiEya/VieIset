const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Participation = require('../models/participation'); // chemin correct vers ton modèle Participation

const {
  getEvents,
  getEvent,
  createEvent,
  registerToEvent
} = require('../controllers/eventController');

const authMiddleware = require('../middlewares/authMiddlewares');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // assure-toi que le dossier existe
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

router.post('/:eventId/register', authMiddleware, registerToEvent);
        
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }]), createEvent);

router.get('/:eventId/participations', async (req, res) => {
  try {
    const participations = await Participation.find({ event: req.params.eventId });
    res.json(participations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible de récupérer les participations.' });
  }
});
router.get('/', authMiddleware, getEvents);     
router.get('/:id', authMiddleware, getEvent); 
module.exports = router;

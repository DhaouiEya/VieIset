const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadEvent');
const {
  getEvents,
  getEvent,
  createEvent,
  registerStudent,
  deleteEvent,
  updateEvent,
  getAllParticipants,
  registerToEvent
} = require('../controllers/eventController');

const authMiddleware = require('../middlewares/authMiddlewares');


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });
// const upload = multer({ storage });


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '../uploads'));
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 50 * 1024 * 1024 // 50MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image and video files are allowed!'), false);
//     }
//   }
// });

router.get('/', getEvents);                  // GET /api/events
router.get('/:id', getEvent);                // GET /api/events/:id
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }]), createEvent);
              // POST /api/events
router.post('/:id/register', registerStudent); // POST /api/events/:id/register
router.delete('/:id', deleteEvent);
//router.put('/:id', upload.fields([{ name: 'lienImage', maxCount: 1 }]), updateEvent);

// PUT avec upload d'image
router.put('/:id', upload.single('lienImage'), updateEvent);
router.get('/:id/participants',getAllParticipants);                
router.post('/:eventId/inscrire', authMiddleware, registerToEvent);
        




module.exports = router;

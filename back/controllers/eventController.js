const Event = require('../models/Event');

// GET /events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().lean();
    const formatted = events.map(e => ({
      ...e,
      id: e._id,
      attendeesCount: e.attendees?.length || 0
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /events/:id
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).lean();
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ ...event, id: event._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createEvent = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    // Extraction des champs du body
    const { title, description, localisation, startDate, endDate, capacity } = req.body;

    if (!title || !description || !localisation || !startDate || !endDate) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
    }

    // Extraction du fichier image
    const imageFile = req.files?.image ? req.files.image[0] : null;
    const lienImage = imageFile ? `/uploads/${imageFile.filename}` : null;

    // Créer l'événement
    const event = new Event({
      title,
      description,
      localisation,
      startDate,
      endDate,
      capacity: capacity || 0,
      lienImage,
      attendees: []
    });

    await event.save();
    res.status(201).json({ ...event.toObject(), id: event._id });

  } catch (err) {
    console.error('Erreur lors de la création de l’événement:', err);
    res.status(500).json({ message: err.message });
  }
};


// POST /events
/*
const createEvent = async (req, res) => {
  try {
    const { title, description, localisation, startDate, endDate, capacity, attendees } = req.body;

    if (!title || !description || !localisation || !startDate || !endDate) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
    }

    const event = new Event({
      title,
      description,
      localisation,
      startDate,
      endDate,
      capacity: capacity || 0,
      attendees: attendees || []
    });

    await event.save();
    res.status(201).json({ ...event.toObject(), id: event._id });
    
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement :', error.message);
    res.status(500).json({ message: error.message });
  }
};
*/
// POST /events/:id/register
// POST /events/:id/register
const registerStudent = async (req, res) => {
  try {
    const { studentId, name } = req.body;
    const { id } = req.params;

    // Vérification des champs obligatoires
    if (!studentId || !name) {
      return res.status(400).json({ message: 'studentId et name sont obligatoires.' });
    }

    // Recherche de l'événement
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Événement introuvable.' });
    }

    // Vérifier si l'étudiant est déjà inscrit
    const alreadyRegistered = event.attendees.some(
      (a) => a.studentId === studentId
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Cet étudiant est déjà inscrit à cet événement.' });
    }

    // Ajouter l'étudiant à la liste des participants
    event.attendees.push({ studentId, name });
    await event.save();

    res.status(200).json({
      message: 'Inscription réussie 🎉',
      eventId: event._id,
      attendeesCount: event.attendees.length,
    });
  } catch (error) {
    console.error('Erreur lors de l’inscription :', error);
    res.status(500).json({ message: 'Erreur serveur lors de l’inscription.' });
  }
};



module.exports = { getEvents, getEvent, createEvent, registerStudent };

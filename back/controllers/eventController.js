const Event = require('../models/Event');
const Etudiant = require('../models/etudiant'); 
exports.updateEvent = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Mettre à jour l'image seulement si un fichier est uploadé
    if (req.file) {
        updateData.lienImage = `/uploads/${req.file.filename}`;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    res.json({ message: "Événement mis à jour avec succès", event: updatedEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.registerStudent = async (req, res) => {
  try {
    const { studentId, lastName, firstName } = req.body;
    const { id } = req.params;

    // Vérification des champs obligatoires
    if (!studentId || !lastName || !firstName) {
      return res.status(400).json({ message: 'studentId ,lastName et firstName sont obligatoires.' });
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
    event.attendees.push({ studentId, lastName, firstName });
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
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllParticipants=async(req,res)=>{
  try{
    const eventId=req.params.id;
    const event=await Event.findById(eventId).lean();
    if(!event){
      return res.status(404).json({message:'Événement introuvable.'});
    }
    res.json({participants:event.attendees||[]});
  }catch(err){
    res.status(500).json({message:err.message});
  }
};




const Participation = require('../models/participation');

// 🔹 Récupérer tous les événements
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();

    res.json(events);
  } catch (err) {
    console.error('Erreur lors de la récupération des événements :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// 🔹 Récupérer un événement par ID
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Événement non trouvé.' });
    res.json(event);
  } catch (err) {
    console.error('Erreur lors de la récupération de l’événement :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// 🔹 Créer un événement (si tu veux l’utiliser avec image)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, startDate, endDate, localisation, capacity } = req.body;

    const newEvent = new Event({
      title,
      description,
      startDate,
      endDate,
      localisation,
      capacity,
      lienImage: req.files?.image ? '/uploads/' + req.files.image[0].filename : null
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error('Erreur lors de la création de l’événement :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// 🔹 Inscrire un étudiant à un événement
exports.registerToEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id; // injecté par le middleware JWT

    // Vérifie si l'événement existe
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Événement introuvable." });
    }

    // Vérifie si l’utilisateur est déjà inscrit
    const already = await Participation.findOne({ etudiant: userId, event: eventId });
    if (already) {
      return res.status(400).json({ message: "Vous êtes déjà inscrit à cet événement." });
    }

    // Crée une nouvelle participation
    await Participation.create({
      etudiant: userId,
      event: eventId
    });

    return res.status(200).json({ message: "Inscription réussie à l'événement !" });
  } catch (err) {
    console.error("Erreur lors de l'inscription :", err);
    return res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
  }
};

exports.getEventParticipations = async (req, res) => {
  try {
    const eventId = req.params.id;
    const participations = await Participation.find({ event: eventId }).populate('etudiant', 'name email');
    res.json(participations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

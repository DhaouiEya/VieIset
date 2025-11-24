const Event = require('../models/event');
const Participation = require('../models/participation');
const fs = require('fs');
const path = require('path');
// 🔹 Récupérer tous les événements
exports.getEvents = async (req, res) => {
  try {
    
    // Récupérer tous les événements
    const rawEvents = await Event.find().sort({ startDate: -1 });

    // Ajouter le nombre de participants pour chaque événement
    const events = await Promise.all(
      rawEvents.map(async (event) => {
        const count = await Participation.countDocuments({ event: event._id });
        return {
          ...event.toObject(), // Convertit le doc Mongoose en objet JS
          nombreParticipants: count
        };
      })
    );

    // Renvoyer directement le tableau
    res.json(events);
  } catch (err) {
    console.error('Erreur lors de la récupération des événements :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// 🔹 Récupérer un événement par ID
exports.getEvent = async (req, res) => {
  try {
    const id_user=req.user ? req.user._id : null;
    console.log("req.user dans getEvent:", req.user?._id);
  const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Événement non trouvé.' });

    let userInscrit = false;

    if (id_user) {
      // Vérifie si une participation existe pour cet user et cet event
      const participation = await Participation.findOne({
        etudiant: id_user,
        event: event._id
      });

      console.log("participation:", participation);

      userInscrit = !!participation; // true si participation trouvée, false sinon
    }
    // Récupère le nombre total de participants pour cet événement
    const nombreParticipants = await Participation.countDocuments({ event: event._id });
    res.json({ event, userInscrit ,nombreParticipants});
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
  }}
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    await Event.findByIdAndDelete(eventId);
    res.status(200).json({ message: 'Événement supprimé avec successe.' });
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'événement :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }}



exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { title, description, startDate, endDate, localisation, capacity } = req.body;

    const updateData = {
      title,
      description,
      startDate,
      endDate,
      localisation,
      capacity
    };

    if (req.files && req.files.image && req.files.image.length > 0) {
      const newImagePath = req.files.image[0].path;

      const event = await Event.findById(eventId);
      if (event.lienImage) {
        fs.unlink(event.lienImage, (err) => {
          if (err) console.warn('Erreur suppression ancienne image :', err);
        });
      }

      updateData.lienImage = newImagePath;
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, { new: true });

    res.json(updatedEvent);
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l\'événement :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    await Event.findByIdAndDelete(eventId);
    res.status(200).json({ message: 'Événement supprimé avec successe.' });
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'événement :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }}



exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { title, description, startDate, endDate, localisation, capacity } = req.body;

    const updateData = {
      title,
      description,
      startDate,
      endDate,
      localisation,
      capacity
    };

    if (req.files && req.files.image && req.files.image.length > 0) {
      const newImagePath = req.files.image[0].path;

      const event = await Event.findById(eventId);
      if (event.lienImage) {
        fs.unlink(event.lienImage, (err) => {
          if (err) console.warn('Erreur suppression ancienne image :', err);
        });
      }

      updateData.lienImage = newImagePath;
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, { new: true });

    res.json(updatedEvent);
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l\'événement :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Service pour créer un poste
const Event = require('../models/event');
const createEvent = async (data) => {
  const {  title,
      description,
      localisation,
      startDate,
      endDate,
      capacity,
      lienImage,
      attendees } = data;

  const event = new Event({
     title,
      description,
      localisation,
      startDate,
      endDate,
      capacity: capacity || 0,
     
      attendees: attendees || [],
    lienImage: lienImage || null,
    
    
  });

  return await event.save();
};

// Service pour récupérer tous les postes
const getAllEvents= async () => {
  return await Event.find();
};
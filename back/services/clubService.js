const Club = require('../models/club');

const createClub = async (data) => {
  const club = new Club(data);
  return await club.save();
};

const getAllClubs = async () => {
  return await Club.find();
};

module.exports = { createClub, getAllClubs };

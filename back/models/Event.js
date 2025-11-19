const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  localisation: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  capacity: { type: Number, default: 0 },
  lienImage: { type: String, default: null },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // <-- correction
});

module.exports = mongoose.model('Event', eventSchema);

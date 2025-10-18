const mongoose = require('mongoose'); // <-- OUBLIE PAS CETTE LIGNE !

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;

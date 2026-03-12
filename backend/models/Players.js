const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({

  playerId: {
    type: String,
    required: true
  },

  name: {                // ADD THIS
    type: String,
    required: true
  },

  roomCode: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["human", "bot"],
    required: true
  },

  role: {
    type: String,
    enum: ["investigator", "imposter"],
    default: null
  },

  position: Number,

  joinedAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.models.Player || mongoose.model("Player", playerSchema);
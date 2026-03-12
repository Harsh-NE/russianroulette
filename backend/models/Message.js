const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({

  roomCode: {
    type: String,
    required: true
  },

  targetPosition: {
    type: Number,
    required: true
  },

  sender: {
    type: String,
    enum: ["investigator", "bot", "imposter"],
    required: true
  },

  text: {
    type: String,
    required: true
  },

  timestamp: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Message", messageSchema);
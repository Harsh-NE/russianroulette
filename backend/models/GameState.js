const mongoose = require("mongoose");

const gameStateSchema = new mongoose.Schema({

  roomCode: {
    type: String,
    required: true
  },

  visitedPositions: {
    type: [Number],
    default: []
  },

  investigatorGuess: {
    type: Number,
    default: null
  },

  result: {
    type: String,
    enum: ["correct", "wrong", null],
    default: null
  },

  gameFinished: {
    type: Boolean,
    default: false
  }

});

module.exports = mongoose.models.GameState || mongoose.model("GameState", gameStateSchema);
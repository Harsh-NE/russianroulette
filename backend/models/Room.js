const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({

  roomCode: {
    type: String,
    required: true,
    unique: true
  },

  status: {
    type: String,
    enum: ["waiting", "active", "finished"],
    default: "waiting"
  },

  participants: {
    type: Number,
    default: 6
  },

  imposterPlayerId: {
    type: String,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.models.Room || mongoose.model("Room", roomSchema);
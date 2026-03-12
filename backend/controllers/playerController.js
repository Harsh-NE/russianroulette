const GameState = require("../models/GameState");
const Player = require("../models/Players");
exports.getImposter = async (req, res) => {

  try {

    const { roomCode } = req.params;

    const imposter = await Player.findOne({
      roomCode,
      role: "imposter"
    });

    if (!imposter) {
      return res.status(404).json({ error: "Imposter not found" });
    }

    res.json({
      position: imposter.position
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};
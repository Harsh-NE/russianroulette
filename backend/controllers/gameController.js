const GameState = require("../models/GameState");
const Player = require("../models/Players");
exports.getVisited = async (req, res) => {

  try {

    const { roomCode } = req.params;

    const game = await GameState.findOne({ roomCode });

    res.json({
      visitedPositions: game.visitedPositions
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};
const Room = require("../models/Room");

exports.submitGuess = async (req, res) => {
  try {
    const { roomCode, guessPosition } = req.body;

    // Find the room
    const room = await Room.findOne({ roomCode });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Find the imposter
    const imposter = await Player.findOne({
      roomCode,
      role: "imposter"
    });
    if (!imposter) {
      return res.status(404).json({ error: "Imposter not found" });
    }

    // Determine result
    const result = imposter.position === parseInt(guessPosition) ? "correct" : "wrong";

    // Update GameState
    const game = await GameState.findOne({ roomCode });
    if (!game) {
      return res.status(404).json({ error: "GameState not found" });
    }

    game.investigatorGuess = parseInt(guessPosition); // save investigator guess
    game.result = result; // save result
    game.gameFinished = true; // mark game as finished
    await game.save();

    // Respond with result
    res.json({
      result,
      gameFinished: game.gameFinished,  
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getResult = async (req, res) => {

  try {

    const { roomCode } = req.params;

    const imposter = await Player.findOne({
      roomCode,
      role: "imposter"
    });
    const game = await GameState.findOne({ roomCode });

    await game.save();
    res.json({
      imposterPosition: imposter.position,
      gameFinished: game.gameFinished,
      investigatorGuess: game.investigatorGuess
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

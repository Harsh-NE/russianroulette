const Room = require("../models/Room");
const Player = require("../models/Players");
const GameState = require("../models/GameState");

async function generateRoomCode() {

  const chars = "0123456789";

  let code;
  let exists = true;

  while (exists) {

    code = "";

    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    const room = await Room.findOne({ roomCode: code });

    if (!room) exists = false;

  }

  return code;
}




exports.createRoom = async (req, res) => {

  try {

    const roomCode = await generateRoomCode();

    const room = new Room({
      roomCode
    });

    await room.save();



    const gameState = new GameState({
      roomCode
    });

    await gameState.save();

    res.json({
      success: true,
      roomCode
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};
exports.joinRoom = async (req, res) => {
  try {
    const { roomCode, name } = req.body;

    const room = await Room.findOne({ roomCode });
    if (!room) return res.status(404).json({ message: "Room not found" });

    const existingPlayers = await Player.find({ roomCode, type: "human" });
    if (existingPlayers.length >= 2)
      return res.status(400).json({ message: "Room full" });

    // Prevent duplicate names
    const nameExists = await Player.findOne({ roomCode, name });
    if (nameExists)
      return res.status(400).json({ message: "Name already taken" });

    // Create player with minimal info (no role/position yet)
    const player = new Player({
      playerId: Date.now().toString(),
      name,
      roomCode,
      type: "human"
    });

    await player.save();

    res.json({ success: true, playerId: player.playerId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.selectRole = async (req, res) => {
  try {
    const { roomCode, name, role } = req.body;

    // Find the human player
    const player = await Player.findOne({ roomCode, name });
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Check if role is already taken
    const roleCount = await Player.countDocuments({ roomCode, role });
    if ((role === "investigator" || role === "imposter") && roleCount >= 1) {
      return res
        .status(400)
        .json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} already chosen` });
    }

    // Update player's role

    if (role === "imposter") {
      // Assign random position 1-6 for imposter
      const imposterPosition = Math.floor(Math.random() * 6) + 1;
      player.position = imposterPosition;
      player.role= "imposter";
      // Create bots in remaining positions 1-6
      const existingBots = await Player.find({ roomCode, type: "bot" });
      if (existingBots.length === 0) {
        const botPositions = [1, 2, 3, 4, 5, 6].filter(p => p !== imposterPosition);
        const bots = botPositions.map(pos => ({
          playerId: `bot_${pos}_${roomCode}`,
          name: `Bot ${pos}`,
          roomCode,
          type: "bot",
          position: pos
        }));
        await Player.insertMany(bots);
      }

      // Store imposter ID in Room
      await Room.updateOne({ roomCode }, { imposterPlayerId: player.playerId });

    } else if (role === "investigator") {
      // Investigator always gets position 7
      player.position = 7;
      player.role = "investigator";
    }

    await player.save();

    res.json({
      success: true,
      role,
      position: player.position,
      playerId: player.playerId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
};
exports.getRoomPlayers = async (req, res) => {

  try {

    const { roomCode } = req.params;

    const players = await Player.find({ roomCode })
      .select("position type role name")
      .sort({ position: 1 });

    res.json({
      success: true,
      players
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};
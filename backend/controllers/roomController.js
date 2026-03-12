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

    const botPositions = [1,2,4,6];


    for (let pos of botPositions) {

  const bot = new Player({
    playerId: "bot_" + pos + "_" + roomCode,
    name: `Bot ${pos}`,
    roomCode,
    type: "bot",
    position: pos
  });


      await bot.save();
    }

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

    if (!room) {

      return res.status(404).json({
        message: "Room not found"
      });

    }

    const existingPlayers = await Player.find({
      roomCode,
      type: "human"
    });

    if (existingPlayers.length >= 2) {

      return res.status(400).json({
        message: "Room full"
      });

    }

    const position = existingPlayers.length === 0 ? 3 : 5;

    const player = new Player({
      playerId: Date.now().toString(),
      name: name,
      roomCode,
      type: "human",
      position
    });

    await player.save();

    res.json({
      success: true,
      playerId: player.playerId,
      position
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};
exports.selectRole = async (req, res) => {

  try {

    const { roomCode, name, role } = req.body;

    const player = await Player.findOne({
      roomCode,
      name
    });

    if (!player) {
      return res.status(404).json({
        message: "Player not found"
      });
    }

    const roleCount = await Player.countDocuments({
      roomCode,
      role
    });

    if (role === "investigator" && roleCount >= 1) {
      return res.status(400).json({
        message: "Investigator already chosen"
      });
    }

    if (role === "imposter" && roleCount >= 1) {
      return res.status(400).json({
        message: "Imposter already chosen"
      });
    }

    //  update role in Players collection
    player.role = role;
    await player.save();

    // store imposter in Room table
    if (role === "imposter") {

      await Room.updateOne(
        { roomCode },
        { imposterPlayerId: player.playerId }
      );

    }

    res.json({
      success: true,
      role,
      playerId: player.playerId
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

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
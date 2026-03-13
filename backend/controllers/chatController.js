const GameState = require("../models/GameState");

exports.openChat = async (req, res) => {

  try {

    const { roomCode, position } = req.body;

    const game = await GameState.findOne({ roomCode });

    if (!game.visitedPositions.includes(position)) {
      game.visitedPositions.push(position);
      await game.save();
    }

    res.json({
      success: true,
      visitedPositions: game.visitedPositions
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

const Message = require("../models/Message");
const Player = require("../models/Players");
const axios = require("axios");

exports.sendMessage = async (req, res) => {

  try {

    const { roomCode, targetPosition, message, sender } = req.body;

    const position = Number(targetPosition);  
    const target = await Player.findOne({
      roomCode,
      position: position
    });

    if (!target) {
      return res.status(404).json({ message: "Participant not found" });
    }

    const userMessage = new Message({
      roomCode,
      targetPosition: position,
      sender,
      text: message
    });

    await userMessage.save();

    if (target.type === "bot") {

      const botResponse = await axios.post(
        "http://localhost:3001/bot-reply",
        {
          slot: position,
          message: message
        }
      );

      const reply = botResponse.data.reply;

      const botMessage = new Message({
        roomCode,
        targetPosition: position,
        sender: "bot",
        text: reply
      });

      await botMessage.save();

      return res.json({
        success: true,
        reply
      });

    }

    if (target.role === "imposter") {

      return res.json({
        success: true,
        imposter: true
      });

    }

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

exports.getChatHistory = async (req, res) => {

  try {

    const { roomCode, position } = req.params;

    const messages = await Message.find({
      roomCode,
      targetPosition: Number(position)
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      messages
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};
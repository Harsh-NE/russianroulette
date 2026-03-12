const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chatController");

// Open chat with a participant
router.post("/open", chatController.openChat);

// Send message to bot or imposter
router.post("/send", chatController.sendMessage);

// Get chat history
router.get("/history/:roomCode/:position", chatController.getChatHistory);

module.exports = router;
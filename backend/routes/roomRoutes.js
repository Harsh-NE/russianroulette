const express = require("express");
const router = express.Router();

const roomController = require("../controllers/roomController");

// Room creation
router.post("/create", roomController.createRoom);

// Join existing room
router.post("/join", roomController.joinRoom);

// Select role (investigator / imposter)
router.post("/select-role", roomController.selectRole);

// Get players in room (positions 1–6)
router.get("/:roomCode/players", roomController.getRoomPlayers);

module.exports = router;
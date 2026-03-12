const express = require("express");
const router = express.Router();

const gameController = require("../controllers/gameController");

// Get visited participants
router.get("/visited/:roomCode", gameController.getVisited);

// Submit investigator guess
router.post("/guess", gameController.submitGuess);

// Get game result
router.get("/result/:roomCode", gameController.getResult);

module.exports = router;
const express = require("express");
const router = express.Router();
const playerController = require("../controllers/playerController");
router.get("/imposter/:roomCode", playerController.getImposter);

module.exports = router;
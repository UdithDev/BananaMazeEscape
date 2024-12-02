const express = require("express");
const { authenticateToken } = require("../middleware/auth.middleware");
const {
  updateScore,
  getLeaderboard,
} = require("../controllers/leaderboard.controller");

const router = express.Router();

router.post("/score", authenticateToken, updateScore);
router.get("/", getLeaderboard);

module.exports = router;

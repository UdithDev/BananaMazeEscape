const Player = require("../models/player.model");

const updateScore = async (req, res) => {
  try {
    const { score } = req.body;
    await Player.findByIdAndUpdate(req.player.id, {
      score,
      lastPlayed: Date.now(),
    });
    res.json({ message: "Score updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update score" });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Player.find()
      .select("username score lastPlayed -_id")
      .sort({ score: -1 })
      .limit(10);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};

module.exports = { updateScore, getLeaderboard };

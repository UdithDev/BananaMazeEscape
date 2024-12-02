const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Player = require("../models/player.model");

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingPlayer = await Player.findOne({ username });

    if (existingPlayer) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const player = new Player({ username, password: hashedPassword });

    await player.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const player = await Player.findOne({ username });

    if (!player) {
      return res.status(400).json({ error: "Player not found" });
    }

    const validPassword = await bcrypt.compare(password, player.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: player._id, username: player.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

module.exports = { register, login };

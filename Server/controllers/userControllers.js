const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();

const jwtSecret = process.env.JWT_SECRET || "dVwTig8Ypk";
const users = [{ username: "udith", password: bcrypt.hashSync("password", 8) }]; // Sample user data
const expiresIn = "1h";

// Login endpoint
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {
    //Generate JWT
    const token = jwt.sign({ username: user.username }, jwtSecret, { expiresIn });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// Verify token endpoint (optional)
router.get("/verify", (req, res) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).send("No token provided.");

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err)
      return res.status(500).json({ message: "Failed to authenticate token." });
    res.json({ message: "Token is valid", user: decoded });
  });
});

module.exports = router;

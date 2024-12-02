const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, player) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.player = player;
    next();
  });
};

module.exports = { authenticateToken };
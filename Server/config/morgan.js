const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

// Ensure logs directory exists
const logsDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const accessLogStream = fs.createWriteStream(path.join(logsDir, "access.log"), {
  flags: "a",
});

morgan.token("body", (req) => JSON.stringify(req.body));

const logFormat =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :body';

const morganMiddleware = {
  dev: morgan("dev"),
  prod: morgan(logFormat, { stream: accessLogStream }),
};

module.exports = morganMiddleware;

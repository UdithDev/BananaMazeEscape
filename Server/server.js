const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
// const connectDB = require("./config/db");

// routes
const userRoutes = require("./controllers/userControllers");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

app.use(userRoutes);

// connectDB()
//   .then((onFul) => console.log(onFul))
//   .catch((onRej) => console.log(onRej));

let PORT = process.env.PORT;
app.listen(PORT, console.log(`Server started on ${PORT}`));

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const port = process.env.PORT || 8000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//db connection
connectDB();

// routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/user", require("./routes/userRoutes"));

app.listen(port, () => {
  console.log(`Server started ${port}`);
});

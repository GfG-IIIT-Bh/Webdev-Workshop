const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const port = process.env.PORT;
const db = require("./config/mongoose");
// const passport_jwt = require("./config/passport_jwt");

//bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.use("/api", require("./api/routes"));

app.listen(port, (err) => {
  if (err) {
    console.log(`error in listening: ${err}`);
  }
  console.log("click here", `http://localhost:${port}`);
});

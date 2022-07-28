const express = require("express");
const path = require("path");
require("dotenv").config();
const getCount = require("./dbControllers.js").getCount;

const app = express();

app.get("/:someTable", (req, res) => {
  getCount();
  res.send();
});

app.listen(process.env.PORT);
console.log(`listening on port ${process.env.PORT}`);

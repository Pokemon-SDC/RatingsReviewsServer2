const express = require("express");
const path = require("path");
require("dotenv").config();
const getCount = require("./dbControllers.js").getCount;

const app = express();

app.get("/:someTable", (req, res) => {
  // bad idea for SQL injection;
  getCount(req.params.someTable)
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.send("Error finding table.  Check your params!");
    });
});

app.listen(process.env.PORT);
console.log(`listening on port ${process.env.PORT}`);

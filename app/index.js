const express = require("express");
const path = require("path");
require("dotenv").config();
const db = require("./dbControllers.js");
// const getCount = require("./dbControllers.js").getCount;

const app = express();

// app.get("/:someTable", (req, res) => {
//   // bad idea for SQL injection;
//   db.getCount(req.params.someTable)
//     .then((data) => {
//       console.log(data);
//       res.send(data);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.send("Error finding table.  Check your params!");
//     });
// });

app.get("/reviews/:product_id", (req, res) => {
  console.log(req.params.product_id);
  db.getReviewsById(req.params.product_id).then((data) => {
    res.send(data[0].rows);
  });
});

app.get("/reviews/:product_id/meta", (req, res) => {
  console.log(req.params.product_id);
  let responseObject = {
    product_id: req.params.product_id,
    characteristics: {},
    recommended: {
      true: 0,
      false: 0,
    },
  };
  db.getRecommendedById(req.params.product_id).then((data) => {
    console.log("recommendations", data);
    data.forEach(function (recommendObj) {
      if (recommendObj.recommend) {
        responseObject.recommended.true++;
      } else {
        responseObject.recommended.false++;
      }
    });
  });
  db.getCharacteristicsById(req.params.product_id).then((data) => {
    data.forEach(function (charObject) {
      console.log(charObject);
      responseObject.characteristics[[charObject.characteristic]] = {
        id: charObject.id,
        value: 0,
      };
    });
    res.send(responseObject);
  });
});

app.listen(process.env.PORT);
console.log(`listening on port ${process.env.PORT}`);

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

app.get("/reviews/", (req, res) => {
  var page, count, sort, product_id;
  // if (Object.keys(req.query).length > 0) {
  //   var { page = 0, count = 5, sort, product_id } = req.query;
  // } else {
  //   var { page = 0, count = 5, sort, product_id } = req.params;
  // }
  db.getReviewsById(1).then((data) => {
    console.log(`GET /${req.params.product_id}: `, data[0].rows);
    res.send({
      product_id: req.params.product_id,
      page: page,
      count: count,
      results: data[0].rows,
    });
  });
  // db.getReviewsById(req.params.product_id).then((data) => {
  // console.log(`GET /${req.params.product_id}: `, data[0].rows);
  // res.send(data[0].rows);
  // });
});

app.get("/reviews/meta", (req, res) => {
  let responseObject = {
    product_id: req.params.product_id,
    characteristics: {},
    recommended: {
      true: 0,
      false: 0,
    },
  };

  // {
  //   "product_id": "2",
  //   "ratings": {
  //     2: 1,
  //     3: 1,
  //     4: 2,
  //     // ...
  //   },
  //   "recommended": {
  //     0: 5
  //     // ...
  //   },
  //   "characteristics": {
  //     "Size": {
  //       "id": 14,
  //       "value": "4.0000"
  //     },
  //     "Width": {
  //       "id": 15,
  //       "value": "3.5000"
  //     },
  //     "Comfort": {
  //       "id": 16,
  //       "value": "4.0000"
  //     },
  //     // ...
  // }

  // db.getRecommendedById(req.params.product_id).then((data) => {
  //   console.log("recommendations", data);
  //   data.forEach(function (recommendObj) {
  //     if (recommendObj.recommend) {
  //       responseObject.recommended.true++;
  //     } else {
  //       responseObject.recommended.false++;
  //     }
  //   });
  // });
  // db.getCharacteristicsById(req.params.product_id).then((data) => {
  //   data.forEach(function (charObject) {
  //     console.log(charObject);
  //     responseObject.characteristics[[charObject.characteristic]] = {
  //       id: charObject.id,
  //       value: 0,
  //     };
  //   });
  //   res.send(responseObject);
  // });
});

app.get("/reviews");

app.listen(process.env.PORT);
console.log(`listening on port ${process.env.PORT}`);

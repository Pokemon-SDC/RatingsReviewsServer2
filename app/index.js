const express = require("express");
const path = require("path");
require("dotenv").config();
const db = require("./dbControllers.js");
const request = require("supertest");
// const getCount = require("./dbControllers.js").getCount;

const app = express();
app.use(express.json());

app.get("/reviews/", (req, res) => {
  db.getReviewsById(
    req.query.product_id,
    req.query.count,
    req.query.page,
    req.query.sort
  )
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send();
    });
});

app.get("/reviews/meta", (req, res) => {
  db.getMeta(req.query.product_id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/reviews", (req, res) => {
  db.addReview(req.body)
    .then(() => {
      res.status(201).send();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.put("/reviews/:review_id/report", (req, res) => {
  db.reportReview(req.params.review_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      res.status(422).send();
      console.log(err);
    });
});

app.put("/reviews/:review_id/helpful", (req, res) => {
  db.findReviewHelpful(req.params.review_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      res.status(422).send();
      console.log(err);
    });
});

app.listen(process.env.PORT);
console.log(`listening on port ${process.env.PORT}`);

module.exports = app;

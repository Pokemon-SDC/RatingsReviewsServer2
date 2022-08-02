const express = require("express");
const path = require("path");
require("dotenv").config();
const db = require("./dbControllers.js");
const request = require("supertest");
const cors = require("cors");
// const getCount = require("./dbControllers.js").getCount;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/reviews", db.getReviewsById);

app.get("/reviews/meta", db.getMeta);

app.post("/reviews", db.addReview);

app.put("/reviews/:review_id/report", db.reportReview);

app.put("/reviews/:review_id/helpful", db.findReviewHelpful);

app.listen(process.env.PORT);
console.log(`listening on port ${process.env.PORT}`);

module.exports = app;

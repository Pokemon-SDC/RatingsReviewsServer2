const app = require("../app");
const request = require("supertest");
const getCount = require("../app/dbControllers.js").getCount;

let reviewQuery = {
  product_id: 1,
  count: 5,
  page: 1,
  sort: "newest",
};
let endpoint = `/reviews/?product_id=${reviewQuery.product_id}&sort=${reviewQuery.sort}&count=${reviewQuery.count}&page=${reviewQuery.page}`;
let badpoint = `/reviews/?product_id=${reviewQuery.product_id}&sort=relevant&page=${reviewQuery.page}`;

describe("given an endpoint with proper params", () => {
  test("should recieve a 200 status code", async () => {
    const response = await request(app).get(endpoint);
    expect(response.statusCode).toBe(200);
  }),
    test("should recieve a JSON object", async () => {
      const response = await request(app).get(endpoint);
      expect(typeof response.body).toBe("object");
    }),
    test("should have properties product_id, page, count, results", async () => {
      const response = await request(app).get(endpoint);
      expect(response.body.product_id).not.toBe(undefined);
      expect(response.body.page).not.toBe(undefined);
      expect(response.body.count).not.toBe(undefined);
      expect(response.body.results).not.toBe(undefined);
    });
});

describe("should have proper results", () => {
  test("should recieve a results array of length 5", async () => {
    const response = await request(app).get(endpoint);
    expect(Array.isArray(response.body.results)).toBe(true);
    expect(response.body.results.length > 0).toBe(true);
    expect(response.body.results.length).toBe(5);
  }),
    test("should be sorted by helpful with helpful query", async () => {
      (reviewQuery.sort = "helpful"),
        (endpoint = `/reviews/?product_id=${reviewQuery.product_id}&sort=${reviewQuery.sort}&count=${reviewQuery.count}&page=${reviewQuery.page}`);
      const response = await request(app).get(endpoint);
      expect(
        response.body.results[0].helpfulness >=
          response.body.results[1].helpfulness
      ).toBe(true);
      expect(
        response.body.results[1].helpfulness >=
          response.body.results[3].helpfulness
      ).toBe(true);
      expect(
        response.body.results[3].helpfulness >=
          response.body.results[4].helpfulness
      ).toBe(true);
    });

  test("should be sorted by date with date query", async () => {
    (reviewQuery.sort = "newest"),
      (endpoint = `/reviews/?product_id=${reviewQuery.product_id}&sort=${reviewQuery.sort}&count=${reviewQuery.count}&page=${reviewQuery.page}`);
    const response = await request(app).get(endpoint);
    expect(response.body.results[0].date >= response.body.results[1].date).toBe(
      true
    );
    expect(response.body.results[1].date >= response.body.results[3].date).toBe(
      true
    );
    expect(response.body.results[3].date >= response.body.results[4].date).toBe(
      true
    );
  });
});

describe("should receive a 400 for bad queries", () => {
  test("should recieve a results array of length 5", async () => {
    const response = await request(app).get(badpoint);
    expect(response.statusCode).toBe(400);
  });
});

describe("should insert into database upon post request", () => {
  test("should add 1 review to reviews table from a post to /reviews, 3 to photos table, 2 to characteristic_reviews table", async () => {
    const beforeReviews = await getCount("reviews");
    const beforePhotos = await getCount("photos");
    const beforeCR = await getCount("characteristic_reviews");
    let response = await request(app)
      .post("/reviews")
      .send({
        product_id: 1,
        rating: 3,
        summary: "some text to enter",
        body: "the body of the review",
        recommend: true,
        name: "someBody",
        email: "someFakeEmail@email.com",
        photos: ["url1.com", "url2.com", "url3.com"],
        characteristics: {
          14: 5,
          15: 1,
        },
      });
    const afterReviews = await getCount("reviews");
    const afterPhotos = await getCount("photos");
    const afterCR = await getCount("characteristic_reviews");
    expect(parseInt(afterReviews)).toBe(parseInt(beforeReviews) + 1);
    expect(parseInt(afterPhotos)).toBe(parseInt(beforePhotos) + 3);
    expect(parseInt(afterCR)).toBe(parseInt(beforeCR) + 2);
    expect(response.statusCode).toBe(201);
  });
});

describe("should not add rows for a broken request", () => {
  test("should not add any rows to the database on a broken request", async () => {
    const beforeReviews = await getCount("reviews");
    console.log(beforeReviews);
    const beforePhotos = await getCount("photos");
    const beforeCR = await getCount("characteristic_reviews");
    let response = await request(app)
      .post("/reviews")
      .send({
        product_id: 1,
        rating: 3,
        summary: "some text to enter",
        body: "the body of the review",
        recommend: true,
        name: "someBody",
        photos: ["url1.com", "url2.com", "url3.com"],
        characteristics: {
          14: 5,
          15: 1,
        },
      });
    const afterReviews = await getCount("reviews");
    const afterPhotos = await getCount("photos");
    const afterCR = await getCount("characteristic_reviews");
    // await new Promise(process.nextTick);
    expect(parseInt(afterReviews)).toBe(parseInt(beforeReviews));
    expect(parseInt(afterPhotos)).toBe(parseInt(beforePhotos));
    expect(parseInt(afterCR)).toBe(parseInt(beforeCR));
    expect(response.statusCode).toBe(400);
  });
});

import http from "k6/http";
import { sleep } from "k6";

export let options = {
  vus: 10000,
  duration: "30s",
};

let review = {
  product_id: 5,
  rating: 3,
  summary: "some text to enter",
  body: "the body of the review",
  recommend: true,
  name: "Shannon",
  email: "someFakeEmail222@email.com",
  photos: ["url1.com", "url2.com", "url3.com"],
  characteristics: {
    14: 5,
    15: 1,
  },
};

// export default () => {
//   http.get("http://localhost:3001/reviews");
// };

export default () => {
  let randomId = Math.round(Math.random() * 100000);
  http.get(
    `http://localhost:3001/reviews/?product_id=${randomId}&sort=relevant&count=5&page=1`
  ),
    http.get(`http://localhost:3001/reviews/meta/?product_id=${randomId}`),
    http.post("http://localhost:3001/reviews", JSON.stringify(review), {
      headers: {
        "Content-Type": "application/json",
      },
    }),
    http.put(`http://localhost:3001/reviews/${randomId}/helpful`);
};

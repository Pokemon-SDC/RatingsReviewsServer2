import http from "k6/http";
import { sleep } from "k6";

export let options = {
  scenarios: {
    constant_request_rate: {
      executor: "constant-arrival-rate",
      rate: 1000,
      timeUnit: "1s",
      duration: "30s",
      preAllocatedVUs: 1000,
      maxVUs: 1000,
    },
  },
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
  if (randomId === 5) {
    randomId = 1;
  }
  http.get(
    `http://localhost:3000/reviews/?product_id=${randomId}&count=5&page=1`
  );
};

import http from "k6/http";
import { sleep } from "k6";

export let options = {
  // stages: [
  //   { target: 1, duration: "15s" },
  //   { target: 10, duration: "0s" },
  //   { target: 10, duration: "15s" },
  //   { target: 15, duration: "0s" },
  //   { target: 15, duration: "15s" },
  //   { target: 50, duration: "0s" },
  //   { target: 50, duration: "15s" },
  //   { target: 100, duration: "0s" },
  //   { target: 100, duration: "15s" },
  //   { target: 1000, duration: "0s" },
  //   { target: 1000, duration: "15s" },
  // ],
  // thresholds: {
  //   http_req_duration: ["avg<50"],
  // },
  scenarios: {
    constant_request_rate: {
      executor: "constant-arrival-rate",
      rate: 1000,
      timeUnit: "1s",
      duration: "30s",
      preAllocatedVUs: 1000,
      maxVUs: 2000,
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
  http.get(
    `http://localhost:3001/reviews/?product_id=${randomId}&sort=relevant&count=5&page=1`
  );
};

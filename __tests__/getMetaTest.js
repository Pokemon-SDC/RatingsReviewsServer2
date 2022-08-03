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
      maxVUs: 2000,
    },
  },
};

export default () => {
  let randomId = Math.round(Math.random() * 100000);
  http.get(`http://localhost:3001/reviews/meta/?product_id=${randomId}`);
};

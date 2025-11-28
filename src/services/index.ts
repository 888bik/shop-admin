import { BASE_URL, TIMEOUT } from "./config";
import MyRequest from "./request";

export const userRequest = new MyRequest({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

export const statisticsRequest = new MyRequest({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

export const imageRequest = new MyRequest({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

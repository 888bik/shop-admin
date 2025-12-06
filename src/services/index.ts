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

export const noticeRequest = new MyRequest({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

export const managerRequest = new MyRequest({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

export const ruleRequest = new MyRequest({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

export const roleRequest = new MyRequest({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

export const skusRequest = new MyRequest({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

export const couponRequest = new MyRequest({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

export const goodsRequest = new MyRequest({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

export const categoryRequest = new MyRequest({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

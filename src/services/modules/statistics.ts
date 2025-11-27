import { statisticsRequest } from "..";

export function getStatistics1() {
  return statisticsRequest
    .request({
      url: "admin/statistics1",
      method: "get",
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

export function getStatistics2() {
  return statisticsRequest
    .request({
      url: "admin/statistics2",
      method: "get",
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

export function getStatistics3(type: string) {
  return statisticsRequest
    .request({
      url: "admin/statistics3",
      method: "get",
      params: {
        type,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

import { statisticsRequest } from "..";

export const getStatistics1 = () => {
  return statisticsRequest.get("admin/statistics1");
};

export const getStatistics2 = () => {
  return statisticsRequest.get("admin/statistics2");
};

export const getStatistics3 = (type: string) => {
  return statisticsRequest.get("admin/statistics3", { params: { type } });
};

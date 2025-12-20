import { statisticsRequest } from "..";

export const getStatistics1 = () => {
  return statisticsRequest.get("admin/dashboard/panels");
};

export const getStatistics2 = () => {
  return statisticsRequest.get("admin/dashboard/status");
};

export const getStatistics3 = (type: string) => {
  return statisticsRequest.get("admin/dashboard/trend", { params: { type } });
};

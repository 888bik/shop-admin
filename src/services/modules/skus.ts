import { skusRequest } from "..";

export interface ISkusItem {
  id: number;
  name: string;
  order: number;
  status: number;
  type: number;
  defaults: string;
  create_time: string;
  update_time: string;
}

interface SkusPayload {
  name: string;
  order: number;
  status: number;
  defaults: string;
}

interface createSkusPayload extends SkusPayload {}
interface updateSkusPayload extends SkusPayload {}

export interface SkusListResponse {
  list: ISkusItem[];
  totalCount: number;
}

export const getSkusList = (page: number) => {
  return skusRequest.get<SkusListResponse>(`admin/skus/${page}`);
};

export const createSkus = (payload: createSkusPayload) => {
  return skusRequest.post("admin/skus", { ...payload });
};

export const deleteSkus = (ids: number | number[]) => {
  //统一转为一维数组
  const arr = Array.isArray(ids) ? ids : [ids];
  return skusRequest.post("admin/skus/delete_all", { ids: arr });
};

export const updateSkus = (id: number, payload: updateSkusPayload) => {
  console.log(payload, "1111111");
  return skusRequest.post(`admin/skus/${id}`, { ...payload });
};

export const updateSkusStatus = (id: number, status: number) => {
  return skusRequest.post(`admin/skus/${id}/update_status`, { status });
};

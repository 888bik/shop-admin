import { managerRequest } from "..";
import type { IManagerItem, IRole } from "@/pages/manager/type";
interface ManagerPayload {
  username: string;
  password: string;
  status?: number;
  avatar: string;
  roleId: number;
}

interface createManagerPayload extends ManagerPayload {}
interface UpdateManagerPayload extends ManagerPayload {}

interface ManagerListResponse {
  list: IManagerItem[];
  totalCount: number;
  roles: IRole[];
}

/**
 * 获取管理员列表
 * @param page
 * @param limit
 * @param keyword
 * @returns
 */
export const getManagerList = (page = 1, limit = 10, keyword = "") => {
  return managerRequest.get<ManagerListResponse>(`admin/manager/${page}`, {
    params: { limit, keyword },
  });
};

/**
 * 添加管理员
 * @param payload
 * @returns
 */
export const createManager = (payload: createManagerPayload) => {
  return managerRequest.post("admin/manager", {
    ...payload,
    role_id: payload.roleId,
  });
};

export const updateManager = (id: number, payload: UpdateManagerPayload) => {
  return managerRequest.post(`admin/manager/${id}`, {
    ...payload,
    role_id: payload.roleId,
  });
};

export const deleteManager = (id: number | number[]) => {
  return managerRequest.post(`admin/manager/${id}/delete`);
};

export const updateManagerStatus = (id: number, status: number) => {
  return managerRequest.post(`admin/manager/${id}/update_status`, { status });
};

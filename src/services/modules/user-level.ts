import { userLevelRequest } from "..";

export interface IUserLevelItem {
  id: number;
  name: string;
  level: number;
  status: number;
  discount: number;
  maxPrice: number;
  maxTimes: number;
}

export interface UserLevelListResponse {
  list: IUserLevelItem[];
  totalCount: number;
}

export interface UserLevelPayload {
  name: string;
  level: number;
  status: number;
  discount: number;
  maxPrice: number;
  maxTimes: number;
}

export interface CreateUserLevelPayload extends UserLevelPayload {}
export interface UpdateUserLevelPayload extends UserLevelPayload {}

export const getUserLevelList = (page: number = 1, limit: number = 10) => {
  return userLevelRequest.get<UserLevelListResponse>("admin/user-level/list", {
    params: { page, limit },
  });
};

export const createUserLevel = (payload: CreateUserLevelPayload) => {
  return userLevelRequest.post("admin/user-level", { ...payload });
};

export const updateUserLevel = (
  id: number,
  payload: UpdateUserLevelPayload
) => {
  return userLevelRequest.post(`admin/user-level/update/${id}`, { ...payload });
};

export const deleteUserLevel = (id: number | number[]) => {
  return userLevelRequest.delete(`admin/user-level/delete/${id}`);
};

export const updateUserLevelStatus = (id: number, status: number) => {
  return userLevelRequest.post("admin/user-level/status", { id, status });
};

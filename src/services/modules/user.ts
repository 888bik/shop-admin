import { userRequest } from "..";

export interface IUserItem {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  phone: string;
  email: string;
  status: number;
  userLevelId: number;
  userLevelName: string;
  shareNum: number;
  shareOrderNum: number;
  orderPrice: number;
  commission: number;
  createTime: string;
}

export interface UserListResponse {
  list: IUserItem[];
  totalCount: number;
}

export const getUserList = (page: number, limit: number, keyword: string) => {
  return userRequest.get<UserListResponse>("admin/users/list", {
    params: { page, limit, keyword },
  });
};

export const deleteUser = (id: number | number[]) => {
  return userRequest.delete(`admin/users/${id}`);
};

export const updateUserStatus = (id: number, status: number) => {
  return userRequest.post("admin/users/status", { id, status });
};

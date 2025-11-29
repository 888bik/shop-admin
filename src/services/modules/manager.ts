import { managerRequest } from "..";

export function getManagerList(
  page: number = 1,
  limit: number = 10,
  keyword: string = ""
) {
  return managerRequest
    .request({
      url: `admin/manager/${page}`,
      method: "get",
      params: {
        limit,
        keyword,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
}

export function addManager(
  username: string,
  password: number,
  roleId: number,
  status: number = 0,
  avatar: string
) {
  return managerRequest
    .request({
      url: "admin/manager",
      method: "post",
      data: {
        username,
        password,
        role_id: roleId,
        status,
        avatar,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
}

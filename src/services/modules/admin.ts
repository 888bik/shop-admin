import { userRequest } from "..";

export function adminLogin(username: string, password: string) {
  return userRequest
    .request({
      url: "admin/login",
      params: { username, password },
      method: "post",
    })
    .then((res) => {
      return res.data.token;
    })
    .catch((err) => {
      console.log("请求失败", err);
    });
}

export function getAdminInfo() {
  return userRequest
    .request({
      url: "admin/getinfo",
      method: "post",
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log("请求失败", err);
    });
}

export function updatePassword(
  oldpassword: string,
  password: string,
  repassword: string
) {
  return userRequest
    .request({
      url: "admin/updatepassword",
      method: "post",
      data: {
        oldpassword,
        password,
        repassword,
      },
    })
    .then((res) => {})
    .catch((err) => {
      console.log(err);
      throw err;
    });
}

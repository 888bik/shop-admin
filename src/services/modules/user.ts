import { userRequest } from "..";

export const userLogin = (username: string, password: string) => {
  return userRequest.post("admin/login", { username, password });
};

export const getUserInfo = () => {
  return userRequest.post("admin/getinfo");
};

/**
 * 更新密码
 * @param oldPassword
 * @param password
 * @param rePassword
 * @returns
 */
export const updatePassword = (
  oldPassword: string,
  password: string,
  rePassword: string
) => {
  return userRequest.post("admin/updatepassword", {
    oldPassword,
    password,
    rePassword,
  });
};

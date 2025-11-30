import { userRequest } from "..";

export const userLogin = (username: string, password: string) => {
  return userRequest.post("admin/login", "", {
    params: { username, password },
  });
};

export const getUserInfo = () => {
  return userRequest.post("admin/getinfo");
};

export const updatePassword = (
  oldpassword: string,
  password: string,
  repassword: string
) => {
  return userRequest.post("admin/updatepassword", {
    oldpassword,
    password,
    repassword,
  });
};

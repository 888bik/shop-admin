import Cookies from "js-cookie";

const TokenKey = "admin-token";

export function setToken(token: string) {
  Cookies.set(TokenKey, token);
}
export function getToken(key: string = TokenKey) {
  return Cookies.get(key);
}
export function removeToken(key: string = TokenKey) {
  Cookies.remove(key);
}

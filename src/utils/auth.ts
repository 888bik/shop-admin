import Cookies from "js-cookie";

export function setToken(tokenKey: string, token: string) {
  Cookies.set(tokenKey, JSON.stringify(token));
}
export function getToken(tokenKey: string) {
  const jsonString = Cookies.get(tokenKey);
  if (jsonString) {
    return JSON.parse(jsonString).token;
  }
}
export function removeToken(tokenKey: string) {
  Cookies.remove(tokenKey);
}

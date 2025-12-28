import Cookies from "js-cookie";

type TokenKey = "accessToken" | "refreshToken";

interface TokenData {
  accessToken?: string;
  refreshToken?: string;
}

// 单独设置某个 token
export function setToken(key: TokenKey, token: string) {
  const tokens: TokenData = getAllTokens() || {};
  tokens[key] = token;
  Cookies.set("tokens", JSON.stringify(tokens));
}

// 获取某个 token
export function getToken(key: TokenKey) {
  const tokens = getAllTokens();
  return tokens?.[key];
}

// 移除某个 token
export function removeToken(key: TokenKey) {
  const tokens = getAllTokens();
  if (!tokens) return;
  delete tokens[key];
  Cookies.set("tokens", JSON.stringify(tokens));
}

// 获取全部 token
export function getAllTokens(): TokenData | null {
  const jsonString = Cookies.get("tokens");
  if (jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("解析 token 失败:", error);
      return null;
    }
  }
  return null;
}

// 清空所有 token
export function clearTokens() {
  Cookies.remove("tokens");
}

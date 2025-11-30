import { getUserInfo } from "@/services/modules/user";
import { defineStore } from "pinia";
import type { IUser, UserState } from "../type";

const useUserStore = defineStore("user", {
  state: (): UserState => {
    return {
      user: null,
      menus: [],
      asideWidth: "250px",
      hasRoutes: false,
      ruleNames: [],
    };
  },
  actions: {
    async fetchUserInfo() {
      const res: IUser = await getUserInfo();
      this.user = res;
      this.menus = res.menus;
      this.ruleNames = res.ruleNames;
    },
  },
  //开启持久化
  persist: {
    key: "user", //localStorage的键值名
    pick: ["user", "menus"], // 持久化这两个字段
    storage: localStorage, //不写默认localStorage
  },
});

export default useUserStore;

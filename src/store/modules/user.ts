import { getUserInfo } from "@/services/modules/user";
import { defineStore } from "pinia";
export interface MenuItem {
  id: number;
  ruleId: number;
  status: number;
  createTime: string;
  updateTime: string;
  name: string;
  desc: string;
  frontpath: any;
  condition: any;
  menu: number;
  order: number;
  icon: string;
  method: string;
  child?: MenuItem[];
}
const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: {},
      menus: [] as MenuItem[],
      asideWidth: "250px",
      hasRoutes: false,
    };
  },
  actions: {
    async fetchUserInfo() {
      const res = await getUserInfo();
      this.user = res;
      this.menus = res.menus;
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

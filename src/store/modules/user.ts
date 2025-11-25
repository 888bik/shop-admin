import { defineStore } from "pinia";

const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: {},
    };
  },
  actions: {},
});

export default useUserStore;

import router from "@/routers";
import { getToken } from "./auth";
import type { NavigationGuardNext } from "vue-router";
import { toast } from "../assets/base-ui/toast";
import { hideFullLoading, showFullLoading } from "../assets/base-ui/loadingBar";
import { addDynamicRoutes } from "./route.utils";
import useUserStore from "@/store/modules/manager";

router.beforeEach(async (to, from, next: NavigationGuardNext) => {
  showFullLoading();

  //登录判断逻辑:
  const token = getToken("admin-token");
  //没有token则强制跳转到登录页
  if (!token && to.path !== "/login") {
    //提示需要先登录
    toast("请先登录", "", "warning");

    //跳转登录页
    return next({ path: "/login" });
  }

  //如果登录了则避免重复登录
  if (token && to.path === "/login") {
    return next({ path: from.path });
  }

  const userStore = useUserStore();

  if (token && !userStore.hasRoutes) {
    if (userStore.menus.length === 0) {
      await userStore.fetchUserInfo();
    }
    addDynamicRoutes(userStore.menus);
    userStore.hasRoutes = true;
    return next({ path: to.path, replace: true });
  }

  //动态设置页面标题
  document.title = `${to.meta.title}-鲜花商城管理系统` || document.title;

  next();
});

router.afterEach(() => {
  hideFullLoading();
});

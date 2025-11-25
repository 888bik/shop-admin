import router from "@/routers";
import { getToken } from "./auth";
import type { NavigationGuardNext } from "vue-router";
import { toast } from "./toast";
import { hideFullLoading, showFullLoading } from "./loadingBar";

router.beforeEach((to, from, next: NavigationGuardNext) => {
  showFullLoading();

  //登录判断逻辑:
  const token = getToken();
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

  let title = to.meta.title as string;
  if (title) {
    document.title = title;
  }

  next();
});

router.afterEach((to, from) => {
  hideFullLoading();
});

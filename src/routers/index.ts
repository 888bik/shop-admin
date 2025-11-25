import {
  createRouter,
  createWebHashHistory,
  type Router,
  type RouteRecordRaw,
} from "vue-router";

import Home from "@/pages/Home.vue";
import NotFound from "@/pages/404.vue";
import Login from "@/pages/Login.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    component: Home,
    meta: {
      title: "后台首页-鲜花商城管理系统",
    },
  },
  {
    path: "/login",
    component: Login,
    meta: {
      title: "登录页-鲜花商城管理系统",
    },
  },
  // 将匹配所有内容并将其放在 `route.params.pathMatch` 下
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

//创建router对象
const router: Router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

import {
  createRouter,
  createWebHashHistory,
  type Router,
  type RouteRecordRaw,
} from "vue-router";

import Home from "../pages/Home.vue";
import NotFound from "../pages/404.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    component: Home,
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

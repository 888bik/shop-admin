import {
  createRouter,
  createWebHashHistory,
  type Router,
  type RouteRecordRaw,
} from "vue-router";

import NotFound from "@/pages/notFound/404.vue";
import DefaultLayout from "@/layout/DefaultLayout.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/home",
    component: DefaultLayout,
    name: "Layout",
    children: [
      {
        path: "/home",
        component: () => import("@/pages/home/home.vue"),
        meta: {
          title: "后台首页",
        },
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/pages/login/login.vue"),
    meta: {
      title: "登录页",
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

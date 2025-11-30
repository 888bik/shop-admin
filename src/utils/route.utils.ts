import router from "@/routers";
import type { MenuItem } from "@/store/type";
import type { RouteRecordRaw } from "vue-router";

const modules = import.meta.glob("@/pages/**/*.vue");

export function loadView(path: string) {
  // path 需要和 import.meta.glob 的 key 对齐，例如 '/src/pages/goods/list.vue'
  return modules[path];
}

function getComponentByPath(componentPath: string) {
  const fullPath = `/src/pages${componentPath}.vue`;
  const mod = modules[fullPath];
  if (!mod) {
    // 回退到 404 组件或空壳
    return () => import("@/pages/notFound/404.vue");
  }
  return mod;
}

export function generateRoutesFromMenus(menus: MenuItem[]): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = [];

  menus.forEach((item) => {
    if (item.child && item.child.length) {
      item.child.forEach((item2: any) => {
        routes.push({
          path: item2.frontpath,
          name: item2.frontpath,
          component: getComponentByPath(item2.frontpath),
          meta: {
            title: item2.name,
          },
        });
      });
    }
  });

  return routes;
}

export function addDynamicRoutes(menus: any[]) {
  const routes = generateRoutesFromMenus(menus);
  //将生成的动态路由添加到Layout下
  for (const r of routes) {
    if (!router.hasRoute(r.name!)) {
      router.addRoute("Layout", r);
    }
  }
}

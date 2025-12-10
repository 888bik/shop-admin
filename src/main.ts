import { createApp, type Directive } from "vue";
import App from "./App.vue";
import "virtual:windi.css";
import router from "./routers";
import "normalize.css";
import "@/assets/css/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/el-notification.css";
import pinia from "./store";
import "@/utils/permission";
import "nprogress/nprogress.css";
import "@/utils/route.utils";

if (!(String.prototype as any).replaceAll) {
  (String.prototype as any).replaceAll = function (
    search: string,
    replacement: string
  ) {
    return this.split(search).join(replacement);
  };
}

const app = createApp(App);

import permission from "./directives/permission";

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(router).use(pinia).use(permission).mount("#app");

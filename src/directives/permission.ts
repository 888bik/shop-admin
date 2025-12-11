import type { App } from "vue";

export default {
  install(app: App) {
    app.directive("permission", {
      //第一个参数为使用指令的元素
      mounted(el, binding) {
        // hasPermission(binding.value, el);
      },
    });
  },
};

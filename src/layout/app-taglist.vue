<template>
  <div class="app-tagList" :style="{ left: userStore.asideWidth }">
    <el-tabs
      v-model="activeTab"
      type="card"
      class="flex-1"
      style="min-width: 100px"
      @tab-change="changeTab"
      @tab-remove="removeTab"
    >
      <el-tab-pane
        v-for="item in tabList"
        :label="item.title"
        :key="item.path"
        :name="item.path"
        :closable="item.path != '/home'"
      ></el-tab-pane>
    </el-tabs>
    <span class="tag-btn">
      <el-dropdown @command="handleClose">
        <span class="el-dropdown-link">
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="clearOther">关闭其他</el-dropdown-item>
            <el-dropdown-item command="clearAll">全部关闭</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
  </div>
  <div class="placeholder"></div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import useUserStore from "@/store/modules/manager";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import Cookies from "js-cookie";

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const activeTab = ref(route.path);
const tabList = ref([
  {
    title: "后台首页",
    path: "/home",
  },
]);

/**
 * tab存在则不添加
 */
onBeforeRouteUpdate((to, from) => {
  activeTab.value = to.path;
  if (!tabList.value.some((v) => v.path === to.path)) {
    tabList.value.push({
      title: to.meta.title as string,
      path: to.path,
    });
  }
  Cookies.set("tabList", JSON.stringify(tabList.value));
});

/**
 *
 * @param e 路径
 */
const changeTab = (e: string) => {
  activeTab.value = e;
  router.push(e);
};

/**
 *
 * @param e 路径
 */
const removeTab = (e: any) => {
  const tabs = tabList.value;
  const active = activeTab.value;

  // 找到要删除的索引
  const index = tabs.findIndex((v) => v.path === e);

  // 过滤掉要删除的tab
  tabList.value = tabs.filter((v) => v.path !== e);

  // 不是当前 tab 则无需跳转
  if (e !== active) return;

  // 当前 tab 被删除切换到邻近 tab
  const next = tabs[index + 1] || tabs[index - 1];

  if (next) {
    activeTab.value = next.path;
    router.push(next.path);
  } else {
    // 若删除后没有其他 tab，跳回首页
    activeTab.value = "/home";
    router.push("/home");
  }
  Cookies.set("tabList", JSON.stringify(tabList.value));
};

const initTabsData = () => {
  const tabsData = JSON.parse(Cookies.get("tabList") || "[]");
  if (tabsData.length) {
    tabList.value = tabsData;
  }
};

initTabsData();

const handleClose = (e: any) => {
  if (e === "clearAll") {
    //只保留首页
    activeTab.value = "/home";
    tabList.value = [
      {
        title: "后台首页",
        path: "/home",
      },
    ];
    router.push("/home");
  } else if (e === "clearOther") {
    //过滤掉只剩当前激活的tab和后台首页
    tabList.value = tabList.value.filter(
      (v) => v.path == "/home" || v.path === activeTab.value
    );
  }

  Cookies.set("tabList", JSON.stringify(tabList.value));
};
</script>

<style scoped>
.app-tagList {
  @apply fixed bg-gray-100 flex items-center px-2;
  align-items: center;
  top: 64px;
  right: 0;
  height: 44px;
  z-index: 100;
}
.placeholder {
  height: 44px;
}
.tag-btn {
  @apply bg-white rounded ml-auto flex items-center justify-center px-2;
  height: 32px;
}
:deep(.el-tabs__header) {
  border: 0 !important;
  @apply mb-0;
}
:deep(.el-tabs__nav) {
  border: 0 !important;
}
:deep(.el-tabs__item) {
  border: 0 !important;
  height: 32px;
  line-height: 32px;
  @apply bg-white mx-1 rounded;
}
:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) {
  line-height: 32px;
  height: 32px;
}
</style>

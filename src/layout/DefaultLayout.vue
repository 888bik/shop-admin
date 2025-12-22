<template>
  <div class="layout">
    <el-container>
      <el-header>
        <AppHeader></AppHeader>
      </el-header>
      <el-container>
        <el-aside :style="{ width: userStore.asideWidth }">
          <AppAside></AppAside>
        </el-aside>
        <el-main>
          <AppTagList></AppTagList>
          <router-view v-slot="{ Component }">
            <transition name="page-fade-slide" mode="out-in">
              <component :is="Component"></component>
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import AppAside from "@/layout/app-aside.vue";
import AppHeader from "@/layout/app-header.vue";
import AppTagList from "@/layout/app-taglist.vue";

import useUserStore from "@/store/modules/manager";

const userStore = useUserStore();
</script>

<style scoped>
/* 页面切换动画 */
.page-fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}
.page-fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.page-fade-slide-enter-active {
  transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.page-fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.page-fade-slide-leave-active {
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

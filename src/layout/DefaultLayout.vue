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
          <transition name="page-fade-slide" mode="out-in">
            <router-view></router-view>
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import AppAside from "@/components/app-aside.vue";
import AppHeader from "@/components/app-header.vue";
import AppTagList from "@/components/app-taglist.vue";

import useUserStore from "@/store/modules/user";

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

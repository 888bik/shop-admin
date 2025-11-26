<template>
  <div class="app-asideMenu" :style="{ width: userStore.asideWidth }">
    <!-- 包裹侧边栏的容器 -->
    <el-menu
      unique-opened
      :collapse="isCollapse"
      :collapse-transition="false"
      class="border-0"
      @select="handleSelect"
      :default-active="defaultActive"
      :default-openeds="defaultOpeneds"
    >
      <template v-for="(item, index) in menusData" :key="index">
        <!-- 这里的index是菜单项的唯一标识 -->
        <el-sub-menu
          v-if="item.child && item.child.length > 0"
          :index="item.name"
        >
          <!-- 一级菜单 -->
          <template #title>
            <el-icon :component="item.icon" />
            <span>{{ item.name }}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item
            v-for="(item2, index2) in item.child"
            :key="index2"
            :index="item2.frontpath"
          >
            <el-icon :component="item2.icon" />
            <span>{{ item2.name }}</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 只有一级菜单 -->
        <el-menu-item v-else :index="item.frontpath">
          <el-icon :component="item.icon" />
          <span>{{ item.name }}</span>
          >
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import useUserStore from "@/store/modules/user";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const userStore = useUserStore();

const router = useRouter();

const route = useRoute();

let menusData = computed(() => {
  return userStore.menus;
});

const isCollapse = computed(() => {
  return !(userStore.asideWidth === "250px");
});

const defaultActive = ref(route.path);
console.log(defaultActive.value);

const defaultOpeneds = ref<string[]>([]);

watch(
  () => route.path,
  () => {
    // 找出当前路径对应的父级菜单 name
    menusData.value.forEach((item) => {
      if (item.child && item.child.some((c) => c.frontpath === route.path)) {
        defaultOpeneds.value = [item.name];
      }
    });
  },
  { immediate: true }
);

/**
 *
 * @param e 二级菜单中index的值，在只有一级菜单时，e为一级菜单index的值
 */
function handleSelect(e: any) {
  console.log(e);
  router.push(e);
}
</script>

<style scoped>
.app-asideMenu {
  top: 64px;
  left: 0;
  bottom: 0;
  overflow: auto;
  transition: all 0.2s;
  @apply shadow-md fixed bg-light-50;
}
.app-asideMenu::-webkit-scrollbar {
  width: 0px;
}
</style>

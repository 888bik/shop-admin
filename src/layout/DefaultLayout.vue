<template>
  <div class="layout">
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-container>
        <el-aside :style="{ width: userStore.asideWidth }">
          <Aside></Aside>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import Aside from "@/components/app-aside.vue";
import Header from "@/components/app-header.vue";
import useUserStore from "@/store/modules/user";

const userStore = useUserStore();
</script>

<style scoped></style>

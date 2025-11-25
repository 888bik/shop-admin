<template>
  <div class="app-header">
    <div class="left">
      <span class="logo">
        <el-icon class="mr-2">
          <eleme-filled />
        </el-icon>
        鲜花商城</span
      >

      <span class="icon-btn-left mx-10">
        <el-tooltip effect="dark" content="收缩">
          <el-icon class="icon-btn">
            <fold />
          </el-icon>
        </el-tooltip>

        <el-tooltip effect="dark" content="刷新">
          <el-icon class="icon-btn mx-4">
            <refresh @click="HandleRefresh" />
          </el-icon>
        </el-tooltip>
      </span>
    </div>

    <div class="right">
      <span class="fullscreen">
        <el-tooltip effect="dark" content="全屏">
          <el-icon class="icon-btn" @click="toggle">
            <template v-if="!isFullscreen">
              <full-screen />
            </template>
            <template v-else>
              <aim />
            </template>
          </el-icon>
        </el-tooltip>
      </span>
      <el-dropdown class="dropdown" @command="handleCommand">
        <span class="dropdown flex items-center mx-6 text-light-50">
          <el-avatar class="mr-2" :size="25" />
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="edPassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <form-drawer
      size="45%"
      title="修改密码"
      ref="formDrawRef"
      v-model="showDrawer"
      @submit="onSubmit"
      @close="onClose"
    >
      <el-form
        ref="formRef"
        :rules="rules"
        :model="form"
        label-width="80px"
        size="small"
      >
        <el-form-item prop="oldPassword" label="旧密码">
          <el-input
            v-model="form.oldPassword"
            placeholder="请输入旧密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="newPassword" label="新密码">
          <el-input
            type="password"
            v-model="form.newPassword"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="rePassword" label="确认密码">
          <el-input
            type="password"
            v-model="form.rePassword"
            placeholder="请输入确认密码"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
    </form-drawer>
  </div>
</template>

<script setup lang="ts">
import { toast } from "@/utils/toast";
import router from "@/routers";
import { removeToken } from "@/utils/auth";
import { UseEdPassword } from "@/hooks/useAdmin";
import FormDrawer from "./formDrawer.vue";
import { useFullscreen } from "@vueuse/core";

const { rules, formRef, showDrawer, onSubmit, form } = UseEdPassword();

const { isFullscreen, toggle } = useFullscreen();

const handleCommand = (e: any) => {
  switch (e) {
    case "edPassword":
      showDrawer.value = true;
      break;
    case "logout":
      logout();
      break;
  }
};

const onClose = () => (showDrawer.value = false);

function logout() {
  removeToken();
  toast("退出登录成功", "", "success");
  router.replace("/login");
}

function HandleRefresh() {
  location.reload();
}
</script>

<style scoped>
.app-header {
  @apply flex items-center justify-between bg-indigo-700 text-light-50 fixed top-0 left-0 right-0;
  height: 64px;
}
.left {
  @apply flex justify-center items-center;
}
.left .logo {
  width: 150px;
  @apply flex justify-center items-center text-xl font-thin;
}
.icon-btn {
  width: 42px;
  height: 64px;
  cursor: pointer;
  font-size: medium;
}
.icon-btn:hover {
  @apply bg-indigo-600;
}
.right {
  @apply flex  justify-center items-center;
}
</style>

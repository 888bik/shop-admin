<template>
  <div>
    <h2>Home页面</h2>
    <div>
      <el-button type="primary" plain @click="logoutBtn">退出登录</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "@/routers";
import useUserStore from "@/store/modules/user";
import { removeToken } from "@/utils/auth";
import { toast } from "@/utils/toast";

const userStore = useUserStore();

function logoutBtn() {
  removeToken();
  toast("退出登录成功", "", "success");
  router.replace("/login"); // replace 避免用户再回退到 /home
}
</script>

<style scoped></style>

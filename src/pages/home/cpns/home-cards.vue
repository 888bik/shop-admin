<template>
  <el-row :gutter="20">
    <el-col
      :span="3"
      :offset="0"
      v-for="(item, index) in iconNavsData"
      :key="index"
    >
      <el-card shadow="hover" class="mt-4" @click="router.push(item.path)">
        <div class="icon-card">
          <span class="icon">
            <el-icon :size="16">
              <component :is="item.icon" :class="item.color" />
            </el-icon>
          </span>
          <span class="title">
            {{ item.title }}
          </span>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import router from "@/routers";

const iconNavsData = [
  {
    icon: "user",
    color: "text-light-blue-500",
    title: "用户",
    path: "/user/list",
  },
  {
    icon: "shopping-cart",
    color: "text-violet-500",
    title: "商品",
    path: "/goods/list",
  },
  {
    icon: "tickets",
    color: "text-fuchsia-500",
    title: "订单",
    path: "/order/list",
  },
  {
    icon: "chat-dot-square",
    color: "text-teal-500",
    title: "评价",
    path: "/comment/list",
  },
  {
    icon: "picture",
    color: "text-rose-500",
    title: "图库",
    path: "/image/list",
  },
  {
    icon: "bell",
    color: "text-green-500",
    title: "公告",
    path: "/notice/list",
  },
  {
    icon: "set-up",
    color: "text-grey-500",
    title: "配置",
    path: "/setting/base",
  },
  {
    icon: "files",
    color: "text-yellow-500",
    title: "优惠券",
    path: "/coupon/list",
  },
];
</script>

<style scoped>
.icon-card {
  @apply flex justify-center flex-col items-center;
}
.icon {
  @apply mb-1;
}
.title {
  @apply text-sm;
}
</style>

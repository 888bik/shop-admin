<template>
  <el-card shadow="never">
    <div class="tip-header">
      <span class="title">{{ title }}</span>
      <el-tag type="danger" effect="plain">
        {{ tip }}
      </el-tag>
    </div>

    <el-divider />

    <el-row :gutter="20">
      <el-col
        :span="6"
        :offset="0"
        v-for="(item, index) in tipData"
        :key="index"
      >
        <el-card shadow="hover" class="border-0 bg-light-400">
          <div class="flex flex-col items-center justify-center">
            <span class="text-xl mb-2">{{ item.value }}</span>
            <span class="text-xs text-gray-500">{{ item.label }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import type { ITipCard } from "../type";

const { title, tip, tipData } = defineProps<ITipCard>();
</script>

<style scoped>
.tip-header {
  @apply flex justify-between items-center mb-3;
}
.title {
  @apply text-sm;
}
</style>

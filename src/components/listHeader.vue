<template>
  <div class="flex item-center justify-between mb-4">
    <el-button type="primary" size="small" @click="$emit('add')"
      >新增</el-button
    >

    <el-tooltip effect="dark" content="刷新" placement="bottom">
      <el-icon class="mr-5" @click="$emit('refresh')"><Refresh /></el-icon>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
interface ListHeaderEmits {
  (e: "add"): void;
  (e: "refresh"): void;
}
defineEmits<ListHeaderEmits>();
</script>

<style scoped></style>

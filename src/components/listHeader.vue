<template>
  <div class="flex item-center justify-between mb-4">
    <div>
      <el-button
        type="primary"
        size="small"
        @click="$emit('add')"
        v-if="layout.includes('create')"
        >新增</el-button
      >
      <el-button
        type="danger"
        size="small"
        @click="$emit('delete')"
        v-if="layout.includes('delete')"
        >批量删除</el-button
      >
    </div>
    <el-tooltip effect="dark" content="刷新" placement="bottom">
      <el-icon class="mr-5" @click="$emit('refresh')"><Refresh /></el-icon>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface ListHeaderEmits {
  (e: "add"): void;
  (e: "refresh"): void;
  (e: "delete"): void;
}
interface ListHeaderProps {
  layout?: string[];
}
const defaultLayout = ["create", "refresh"];

const props = defineProps<ListHeaderProps>();

// 合并（并去重）
const layout = computed(() => {
  return Array.from(new Set([...(props.layout ?? []), ...defaultLayout]));
});
defineEmits<ListHeaderEmits>();
</script>

<style scoped></style>

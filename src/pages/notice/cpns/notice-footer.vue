<template>
  <div class="flex items-center justify-center">
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="currentPage"
      @current-change="$emit('change', $event)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  total: Number,
  currentPage: Number,
});
defineEmits(["change"]);
</script>

<style scoped></style>

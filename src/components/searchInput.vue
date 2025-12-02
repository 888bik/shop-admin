<template>
  <div class="search-box">
    <div>
      <span class="text-gray-400 mr-3">关键词</span>
      <el-input
        v-model="keyword"
        placeholder="请输入关键词搜索"
        clearable
        @keyup.enter="onSearch"
        style="width: 220px"
        class="search-input"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>
    <div>
      <el-button type="primary" class="ml-2" @click="onSearch" size="small">
        <el-icon class="mr-1"><Search /></el-icon> 搜索
      </el-button>
      <el-button class="ml-1" @click="onReset" size="small"
        ><el-icon class="mr-1"><Refresh /></el-icon> 重置</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits(["update:modelValue", "search"]);

const keyword = ref(props.modelValue);

// 父组件更新时同步
watch(
  () => props.modelValue,
  (v) => (keyword.value = v)
);

const onSearch = () => {
  emit("update:modelValue", keyword.value);
  emit("search", keyword.value);
};

const onReset = () => {
  keyword.value = "";
  emit("update:modelValue", "");
  emit("search", "");
};
</script>

<style scoped>
.search-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 12px;
  padding: 12px;
}

.search-input {
  width: 250px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 6px;
  box-shadow: none !important;
  border: 1px solid #dcdfe6;
  transition: all 0.2s;
}

.search-input :deep(.el-input__wrapper:hover) {
  border-color: #a8abb2;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.15);
}
</style>

<template>
  <div class="search-box">
    <div class="search-input-left flex items-center gap-4">
      <div class="field">
        <span class="text-gray-400 mr-3">关键词</span>
        <el-input
          v-model="keyword"
          placeholder="请输入关键词搜索"
          clearable
          @keyup.enter="onSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <div class="field">
        <span class="text-gray-400 mr-3">{{ labelName }}</span>
        <slot> </slot>
      </div>
    </div>

    <div class="search-input-right">
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
  labelName?: string;
}>();

const emit = defineEmits(["update:modelValue", "search"]);

const keyword = ref(props.modelValue);

// const fields = [
//   {
//     type: "input",
//     label: "关键词",
//     model: "keyword",
//     placeholder: "请输入关键词",
//     prefixIcon: Search,
//   },
//   {
//     type: "select",
//     label: "分类",
//     model: "category_id",
//     placeholder: "请选择分类",
//     prefixIcon: Select,
//     options: categoryList,
//   },
//   { type: "date", label: "创建时间", model: "date" },
// ];

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

.field {
  display: flex;
  width: 220px; /* 搜索框和下拉框同宽 */
  align-items: center;
  margin-right: 20px;
}

.field :deep(.el-input),
.field :deep(.el-select) {
  flex: 1;
}
</style>

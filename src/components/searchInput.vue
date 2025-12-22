<template>
  <div class="search-box">
    <div class="search-input-left flex items-center gap-4">
      <template v-for="field in fields" :key="field.model">
        <div class="field">
          <span class="text-gray-400 mr-3">{{ field.label }}</span>

          <!-- 输入框 -->
          <el-input
            v-if="field.type === 'input'"
            v-model="form[field.model]"
            :placeholder="field.placeholder"
            clearable
            @keyup.enter="onSearch"
          >
            <template #prefix>
              <el-icon v-if="field.prefixIcon"
                ><component :is="field.prefixIcon"
              /></el-icon>
            </template>
          </el-input>

          <!-- 下拉选择框 -->
          <el-select
            v-else-if="field.type === 'select'"
            v-model="form[field.model]"
            :placeholder="field.placeholder"
            clearable
          >
            <el-option
              v-for="option in field.options || []"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>

          <!-- 日期选择框 -->
          <el-date-picker
            v-else-if="field.type === 'date'"
            v-model="form[field.model]"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
        </div>
      </template>
    </div>

    <div class="search-input-right">
      <el-button type="primary" class="ml-2" @click="onSearch" size="small">
        <el-icon class="mr-1"><Search /></el-icon> 搜索
      </el-button>
      <el-button class="ml-1" @click="onReset" size="small">
        <el-icon class="mr-1"><Refresh /></el-icon> 重置
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";

interface IProps {
  fields: {
    type: "input" | "select" | "date";
    label: string;
    model: string;
    placeholder?: string;
    prefixIcon?: any;
    options?: { label: string; value: any }[];
  }[];

  modelValue?: Record<string, any>;
}

const props = defineProps<IProps>();

const emit = defineEmits(["update:modelValue", "search"]);

// 初始化表单数据
const form = reactive<Record<string, any>>({});
props.fields.forEach((f) => {
  form[f.model] = props.modelValue?.[f.model] ?? "";
});

// 父组件更新时同步
watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      Object.keys(v).forEach((key) => {
        if (form.hasOwnProperty(key)) form[key] = v[key];
      });
    }
  },
  { deep: true }
);

// 搜索
const onSearch = () => {
  if (!props.modelValue) return;

  // 直接修改父对象（保持引用不变）
  Object.keys(form).forEach((key) => {
    props.modelValue![key] = form[key];
  });

  // emit 同一个引用
  emit("update:modelValue", props.modelValue);
  emit("search", props.modelValue);
};

// 重置
const onReset = () => {
  if (!props.modelValue) return;

  Object.keys(form).forEach((key) => {
    form[key] = "";
    props.modelValue![key] = "";
  });

  emit("update:modelValue", props.modelValue);
  emit("search", props.modelValue);
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
  width: 220px;
  align-items: center;
}

.field :deep(.el-input),
.field :deep(.el-select),
.field :deep(.el-date-picker) {
  flex: 1;
}
</style>

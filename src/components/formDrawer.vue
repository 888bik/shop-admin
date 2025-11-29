<template>
  <el-drawer
    :title="title"
    :size="size"
    :destroy-on-close="destroyOnClose"
    :close-on-click-modal="closeOnClickModal"
    :teleported="true"
    append-to-body
    v-model="visible"
  >
    <div class="formDrawer">
      <div class="body">
        <slot></slot>
      </div>
      <div class="bottom-btn">
        <el-button @click="submit" type="primary">{{ confirmText }}</el-button>
        <el-button @click="close" type="default">取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed } from "vue";

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit"): void;
}>();

const props = withDefaults(
  defineProps<{
    modelValue: boolean; // 用于 v-model
    title: string;
    size?: string;
    confirmText?: string;
    destroyOnClose?: boolean;
    closeOnClickModal?: boolean;
  }>(),
  {
    size: "45%",
    confirmText: "提交",
    destroyOnClose: false,
    closeOnClickModal: false,
  }
);

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const submit = () => emit("submit");
const close = () => emit("update:modelValue", false);
</script>

<style scoped>
.formDrawer {
  width: 100%;
  height: 100%;
  position: relative;
  @apply flex flex-col;
}

.formDrawer .body {
  flex: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  overflow-y: auto;
}

.formDrawer .bottom-btn {
  height: 50px;
  @apply mt-auto flex items-center;
}
</style>

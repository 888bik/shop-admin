<template>
  <el-drawer
    :title="title"
    :size="size"
    :destroy-on-close="destroyOnClose"
    :close-on-click-modal="closeOnClickModal"
    :teleported="true"
    append-to-body
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
interface FormDrawerProps {
  title: string;
  size: string;
  confirmText?: string;
  destroyOnClose?: boolean;
  closeOnClickModal?: boolean;
}
interface FormDrawerEmits {
  (e: "submit"): void;
  (e: "close"): void;
}

const {
  title,
  size = "45%",
  confirmText = "提交",
  destroyOnClose = false, //控制是否在关闭 Drawer 之后将子元素全部销毁
  closeOnClickModal = false, //是否可以通过点击 modal 关闭 Drawer,设置为false，防止误触
} = defineProps<FormDrawerProps>();

const emits = defineEmits<FormDrawerEmits>();

const submit = () => {
  return emits("submit");
};
const close = () => {
  return emits("close");
};
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

<template>
  <el-button type="primary" size="small" @click="add">新增图片分类</el-button>
  <el-button type="warning" size="small" @click="onUploadImg"
    >上传图片</el-button
  >
</template>

<script setup lang="ts">
const emit = defineEmits(["add", "uploadImg"]);

const add = () => {
  emit("add");
};

const onUploadImg = () => {
  emit("uploadImg", "上传图片");
};
</script>

<style scoped></style>

<template>
  <el-button type="primary" size="small" @click="addCategory"
    >新增图片分类</el-button
  >
  <el-button type="warning" size="small" @click="onUploadImg"
    >上传图片</el-button
  >
</template>

<script setup lang="ts">
const emit = defineEmits(["addCategory", "uploadImg"]);

const addCategory = () => {
  emit("addCategory");
};

const onUploadImg = () => {
  emit("uploadImg");
};
</script>

<style scoped></style>

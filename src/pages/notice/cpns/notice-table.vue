<template>
  <el-table :data="data" stripe style="width: 100%" v-loading="loading">
    <el-table-column prop="title" label="公告标题" />
    <el-table-column
      prop="create_time"
      label="发布时间"
      width="380"
      align="center"
    />
    <el-table-column label="操作" width="180" align="center">
      <template #default="scope">
        <span style="margin-left: 10px">
          <el-button
            type="primary"
            size="small"
            text
            @click="
              $emit('edit', {
                id: scope.row.id,
                title: scope.row.title,
                content: scope.row.content,
              })
            "
            >修改</el-button
          >
          <el-button
            type="primary"
            size="small"
            text
            @click="$emit('delete', scope.row.id)"
            >删除</el-button
          >
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
defineProps({
  data: Array,
  loading: Boolean,
});
defineEmits(["edit", "delete"]);
</script>

<style scoped></style>

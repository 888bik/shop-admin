<template>
  <el-table :data="data" stripe style="width: 100%" v-loading="loading">
    <el-table-column prop="username" label="管理员">
      <template #default="scope">
        <div class="flex items-center gap-5">
          <el-avatar :size="40" :src="scope.row.avatar">
            <img
              src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
            />
          </el-avatar>

          <div class="flex flex-col">
            <span class="font-medium leading-tight">
              {{ scope.row.username }}
            </span>
            <span class="text-xs text-gray-500 mt-0.5">
              ID:{{ scope.row.id }}
            </span>
          </div>
        </div>
      </template>
    </el-table-column>

    <el-table-column prop="role.name" label="所属角色" align="center" />
    <el-table-column prop="status" label="状态" align="center">
      <template #default="scope">
        <el-switch
          v-model="scope.row.status"
          :active-value="1"
          :inactive-value="0"
          @change="$emit('status-change', scope.row)"
        />
      </template>
    </el-table-column>
    <el-table-column label="操作" width="180" align="center">
      <template #default="scope">
        <span style="margin-left: 10px">
          <el-button type="primary" size="small" text @click="$emit('edit', {})"
            >修改</el-button
          >
          <el-button type="primary" size="small" text @click="$emit('delete')"
            >删除</el-button
          >
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps({
  data: Array,
  loading: Boolean,
});
defineEmits(["edit", "delete", "status-change"]);
</script>

<style scoped></style>

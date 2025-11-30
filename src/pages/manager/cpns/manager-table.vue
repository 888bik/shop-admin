<template>
  <el-main>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      v-loading="isLoading"
    >
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
            @change="handleChangeStatus(scope.row.id, scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <span style="margin-left: 10px">
            <el-button
              type="primary"
              size="small"
              text
              @click="$emit('edit', scope.row)"
              >修改</el-button
            >
            <el-button
              type="primary"
              size="small"
              text
              @click="handleDeleteManager(scope.row.id)"
              >删除</el-button
            >
          </span>
        </template>
      </el-table-column>
    </el-table>
  </el-main>

  <el-footer class="flex items-center justify-center mb-3">
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      :current-page="currentPage"
      @current-change="handlePageChange"
    />
  </el-footer>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { IManagerData, IManagerItem, IRole } from "../type";
import {
  deleteManagerById,
  getManagerList,
  updateManagerStatus,
} from "@/services/modules/manager";
import { toast } from "@/assets/base-ui/toast";
interface TableProps {}
interface TableEmits {
  (e: "set-roles", roles: IRole[]): void;
  (e: "edit", role: IManagerItem): void;
  (e: "delete", id: number): void;
  (e: "status-change", status: number): void;
}

defineProps<TableProps>();

const emit = defineEmits<TableEmits>();

const tableData = ref<IManagerItem[]>([]);
const currentPage = ref(1);
const totalCount = ref(0);
const isLoading = ref(false);
const limit = ref(10);

const getTableData = async () => {
  isLoading.value = true;
  const res: IManagerData = await getManagerList(
    currentPage.value,
    limit.value
  );

  tableData.value = res.list;
  totalCount.value = res.totalCount;
  emit("set-roles", res.roles);

  isLoading.value = false;

  // roles.value = res.roles;
};
const handleDeleteManager = async (id: number) => {
  await deleteManagerById(id);
  toast("删除成功");
  getTableData();
};
const handleChangeStatus = async (id: number, status: number) => {
  isLoading.value = true;
  await updateManagerStatus(id, status);
  toast("修改成功");
  isLoading.value = false;
};
const handlePageChange = (page: number) => {
  currentPage.value = page;
};
watch(currentPage, () => {
  getTableData();
});
getTableData();

defineExpose({
  getTableData,
});
</script>

<style scoped></style>

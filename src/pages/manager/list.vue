<template>
  <div class="manager-page">
    <el-card shadow="never" class="border-0">
      <SearchInput
        v-model="searchQuery"
        @search="onSearch"
        :fields="searchFields"
      />
      <ListHeader @refresh="getTableData" @add="openAdd" />

      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="tableLoading"
      >
        <el-table-column prop="username" label="管理员">
          <template #default="scope">
            <div class="flex items-center gap-5">
              <el-avatar :size="40" :src="scope.row.avatar" class="shrink-0">
                <img
                  src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                />
              </el-avatar>

              <div class="flex flex-col max-w-[140px] overflow-hidden">
                <span class="font-medium leading-tight truncate">
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
                @click="openEdit({ ...scope.row, role: scope.row.role?.id })"
                >修改</el-button
              >
              <el-button
                type="primary"
                size="small"
                text
                @click="handleDelete(scope.row.id)"
                >删除</el-button
              >
            </span>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex items-center justify-center mt-4">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalCount"
          :current-page="currentPage"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <form-drawer
      :title="title"
      @submit="submit"
      ref="formDrawerRef"
      v-model="visible"
    >
      <el-form
        :model="form"
        ref="formRef"
        label-width="80px"
        :inline="false"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
          />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <ImageSelect :multiple="false" v-model="form.avatar" />
        </el-form-item>

        <el-form-item label="所属角色">
          <el-select v-model="form.role" placeholder="选择所属角色">
            <el-option
              v-for="(item, index) in roles"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
    </form-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import ImageList from "@/pages/image/list.vue";
import ListHeader from "@/components/listHeader.vue";
import type { IManagerItem, IRole } from "./type";
import { useFormDrawer } from "@/hooks/useFormDrawer";
import { useImageSelector } from "@/hooks/useImageSelector";
import SearchInput from "@/components/searchInput.vue";
import {
  createManager,
  deleteManager,
  getManagerList,
  updateManager,
  updateManagerStatus,
} from "@/services/modules/manager";
import FormDrawer from "@/components/formDrawer.vue";
import { useTable } from "@/hooks/useTable";

const { dialogVisible, imageUrl, handleSelect } = useImageSelector();

const roles = ref<IRole[]>();
const searchQuery = reactive({
  keyword: "",
});
const searchFields = computed(() => [
  {
    type: "input" as "input",
    label: "用户名",
    model: "keyword",
    placeholder: "请输入用户名",
    prefixIcon: "search",
  },
]);

const {
  tableData,
  tableLoading,
  currentPage,
  totalCount,
  query,
  getTableData,
  handleDelete,
  handleChangeStatus,
  handlePageChange,
} = useTable<IManagerItem>({
  listApi: (page, limit, query) => getManagerList(page, limit, query.keyword),
  deleteApi: deleteManager,
  updateStatusApi: updateManagerStatus,
  pageSize: 10,
  initialQuery: {}, // 如果有搜索参数放这里
});
const {
  visible,
  title,
  openAdd,
  openEdit,
  form,
  rules,
  submit,
  formRef,
  formDrawerRef,
  formDrawerLoading,
} = useFormDrawer(
  {
    username: [{ required: true, message: "用户名不能为空" }],
    password: [{ required: true, message: "密码不能为空" }],
    avatar: [{ required: true, message: "请选择头像" }],
    role: [{ required: true, message: "请选择角色" }],
  },
  {
    username: "",
    password: "",
    avatar: "",
    role: "",
    status: 0,
    roleId: 0,
  },
  {
    createApi: createManager,
    updateApi: updateManager,
  },
  () => getTableData()
);

const init = async () => {
  const res = await getTableData();

  roles.value = res.roles ?? [];
};
init();

const onSearch = (form: Record<string, any>) => {
  query.value = {
    ...query.value,
    ...form,
  };
  getTableData(1);
};

watch(imageUrl, (val) => {
  if (val) {
    form.avatar = val;
  }
});

watch(
  () => form.role,
  (val) => {
    form.roleId = val;
  }
);
</script>

<style scoped>
::v-deep(.el-dialog) {
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  margin: 0 !important;
}
.avatar-picker {
  @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:(bg-gray-100);
}
</style>

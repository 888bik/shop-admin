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
        <el-table-column label="会员" width="200">
          <template #default="{ row }">
            <div class="flex items-center">
              <el-avatar :size="40" :src="row.avatar">
                <img
                  src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                />
              </el-avatar>
              <div class="ml-3">
                <h6>{{ row.username }}</h6>
                <small>ID:{{ row.id }}</small>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="会员等级" align="center">
          <template #default="{ row }">
            {{ row.userLevelName || "-" }}
          </template>
        </el-table-column>
        <el-table-column label="登录注册" align="center">
          <template #default="{ row }">
            <p v-if="row.last_login_time">
              最后登录 : {{ row.last_login_time }}
            </p>
            <p>注册时间 : {{ timeUtils.format(row.createTime) }}</p>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              :modelValue="row.status"
              :active-value="1"
              :inactive-value="0"
              :loading="row.statusLoading"
              :disabled="row.super == 1"
              @change="handleChangeStatus(row.id, $event)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <small v-if="scope.row.super == 1" class="text-sm text-gray-500"
              >暂无操作</small
            >
            <div v-else>
              <el-popconfirm
                title="是否要删除该记录？"
                confirmButtonText="确认"
                cancelButtonText="取消"
                @confirm="handleDelete(scope.row.id)"
              >
                <template #reference>
                  <el-button text type="primary" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
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
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import ListHeader from "@/components/listHeader.vue";
import { useFormDrawer } from "@/hooks/useFormDrawer";
import SearchInput from "@/components/searchInput.vue";

import FormDrawer from "@/components/formDrawer.vue";
import { useTable } from "@/hooks/useTable";
import {
  deleteUser,
  getUserList,
  updateUserStatus,
  type IUserItem,
} from "@/services/modules/user";
import { timeUtils } from "@/utils/date";

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
} = useTable<IUserItem>({
  listApi: (page, limit, query) => getUserList(page, limit, query.keyword),
  deleteApi: deleteUser,
  updateStatusApi: updateUserStatus,
  pageSize: 10,
  initialQuery: {},
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
  {},
  {
    // createApi: createManager,
    // updateApi: updateManager,
  },
  () => getTableData()
);

const init = async () => {
  await getTableData();
};
init();

const onSearch = (form: Record<string, any>) => {
  query.value = {
    ...query.value,
    ...form,
  };
  getTableData(1);
};
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

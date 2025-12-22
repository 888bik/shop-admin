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
        v-loading="loading"
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
            {{ row.user_level?.name || "-" }}
          </template>
        </el-table-column>
        <el-table-column label="登录注册" align="center">
          <template #default="{ row }">
            <p v-if="row.last_login_time">
              最后登录 : {{ row.last_login_time }}
            </p>
            <p>注册时间 : {{ row.create_time }}</p>
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
              @change="handleStatusChange($event, row)"
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
              <el-button
                type="primary"
                size="small"
                text
                @click="handleEdit(scope.row)"
                >修改</el-button
              >

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

        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
    </form-drawer>

    <el-dialog
      v-model="dialogVisible"
      title="选择图片"
      width="80%"
      top="5vh"
      :close-on-click-modal="false"
    >
      <ImageList @select="handleSelect" :enable-preview="false" />

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import ImageList from "@/pages/image/list.vue";
import ListHeader from "@/components/listHeader.vue";
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
} = useTable({
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

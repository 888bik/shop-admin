<template>
  <div class="skus-page">
    <el-card shadow="never" class="border-0">
      <list-header
        @refresh="getTableData"
        @add="openAdd"
        :layout="['delete']"
        @delete="handleDelete"
      />
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="tableLoading"
        ref="multipleTableRef"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="规格名称">
          <template #default="scope">
            <div class="flex items-center gap-5">
              <div class="flex flex-col">
                <span class="font-medium leading-tight">
                  {{ scope.row.name }}
                </span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="defaults" label="规格值" align="center" />
        <el-table-column prop="order" label="排序" align="center" />
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
        <el-table-column label="操作" width="250" align="center">
          <template #default="scope">
            <span style="margin-left: 10px">
              <el-button
                type="primary"
                size="small"
                text
                @click="openEdit(scope.row)"
                >修改</el-button
              >
              <el-popconfirm
                title="是否要删除该记录？"
                confirmButtonText="确认"
                cancelButtonText="取消"
                @confirm.stop="handleDelete(scope.row.id)"
              >
                <template #reference>
                  <el-button type="primary" size="small" text>删除</el-button>
                </template>
              </el-popconfirm>
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
      v-model="visible"
      @submit="submit"
      ref="formDrawerRef"
    >
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="80px"
        :inline="false"
      >
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="form.name" placeholder="规格名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="1000" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>

        <el-form-item label="规则值" prop="defaults">
          <TagInput v-model="form.defaults" />
        </el-form-item>
      </el-form>
    </form-drawer>
  </div>
</template>

<script setup lang="ts">
import ListHeader from "@/components/listHeader.vue";
import { useFormDrawer } from "@/hooks/useFormDrawer";
import FormDrawer from "@/components/formDrawer.vue";
import TagInput from "@/components/tagInput.vue";
import {
  createSkus,
  deleteSkus,
  getSkusList,
  updateSkus,
  updateSkusStatus,
  type ISkusItem,
} from "@/services/modules/skus";
import { useTable } from "@/hooks/useTable";

const {
  tableData,
  tableLoading,
  currentPage,
  totalCount,
  getTableData,
  handleDelete,
  handleChangeStatus,
  handleSelectionChange,
  handlePageChange,
} = useTable<ISkusItem>({
  listApi: (page, limit) => getSkusList(page),
  deleteApi: deleteSkus,
  updateStatusApi: updateSkusStatus,
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
  formDrawerRef,
  formRef,
  formDrawerLoading,
  submit,
} = useFormDrawer(
  {
    name: [{ required: true, message: "请输入规格名称" }],
    defaults: [{ required: true, message: "请添加规格值" }],
  },
  {
    name: "",
    order: 50,
    status: 1,
    defaults: "",
  },
  {
    createApi: createSkus,
    updateApi: updateSkus,
  },
  () => getTableData()
);

const init = async () => {
  await getTableData();
};
init();
</script>

<style scoped></style>

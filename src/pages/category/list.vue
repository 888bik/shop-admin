<template>
  <div class="category-page">
    <el-card shadow="never" class="border-0" v-loading="tableLoading">
      <list-header @refresh="getTableData" @add="openAdd" />
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="name" label="分类名称">
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
              <el-button type="primary" size="small" text>推荐商品</el-button>
              <el-button
                type="primary"
                size="small"
                text
                @click="openEdit(scope.row)"
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
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="分类名称"></el-input>
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
      </el-form>
    </form-drawer>
  </div>
</template>

<script setup lang="ts">
import ListHeader from "@/components/listHeader.vue";

import { useFormDrawer } from "@/hooks/useFormDrawer";
import FormDrawer from "@/components/formDrawer.vue";
import { useTable } from "@/hooks/useTable";
import {
  createCategory,
  deleteCategory,
  getCategoryList,
  updateCategory,
  updateCategoryStatus,
} from "@/services/modules/category";

const {
  tableData,
  tableLoading,
  currentPage,
  totalCount,
  getTableData,
  handleDelete,
  handleChangeStatus,
  handlePageChange,
} = useTable({
  listApi: (page, limit) => getCategoryList(page, limit),
  deleteApi: deleteCategory,
  updateStatusApi: updateCategoryStatus,
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
  formDrawerRef,
  formRef,
  submit,
} = useFormDrawer(
  {
    name: [{ required: true, message: "请输入角色昵称" }],
  },
  {
    name: "",
    status: 1,
    order: 50,
  },
  {
    createApi: createCategory,
    updateApi: updateCategory,
  },
  () => getTableData()
);

const init = async () => {
  await getTableData();
};
init();
</script>

<style scoped></style>

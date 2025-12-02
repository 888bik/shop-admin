<template>
  <div class="role-page">
    <el-card shadow="never" class="border-0" v-loading="loading">
      <list-header @refresh="getTableData" @add="openAdd" />
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="isLoading"
      >
        <el-table-column prop="name" label="角色名称">
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

        <el-table-column prop="desc" label="角色描述" align="center" />
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
                @click="openSetRule(scope.row)"
                >配置权限</el-button
              >
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
                @click="handleDeleteRole(scope.row.id)"
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
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input
            v-model="form.desc"
            placeholder="角色描述"
            type="textarea"
            :rows="5"
          ></el-input>
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

    <!-- 权限配置 -->
    <form-drawer
      v-model="showRulesDrawer"
      ref="setRuleFormDrawerRef"
      title="权限配置"
      @submit="handleSetRuleSubmit"
    >
      <el-tree-v2
        ref="elTreeRef"
        node-key="id"
        :check-strictly="checkStrictly"
        :default-expanded-keys="defaultExpandedKeys"
        :data="ruleList"
        :props="{ label: 'name', children: 'child' }"
        show-checkbox
        :height="treeHeight"
        @check="handleTreeCheck"
      >
        <template #default="{ node, data }">
          <div class="flex items-center">
            <el-tag :type="data.menu ? undefined : 'info'" size="small">
              {{ data.menu ? "菜单" : "权限" }}
            </el-tag>
            <span class="ml-2 text-sm"> {{ data.name }} </span>
          </div>
        </template>
      </el-tree-v2>
    </form-drawer>
  </div>
</template>

<script setup lang="ts">
import ListHeader from "@/components/listHeader.vue";
import { ref, watch } from "vue";
import { toast } from "@/assets/base-ui/toast";
import {
  createRole,
  deleteRole,
  getRoleList,
  updateRole,
  updateRoleStatus,
  type IRoleItem,
} from "@/services/modules/role";
import { useFormDrawer } from "@/hooks/useFormDrawer";
import FormDrawer from "@/components/formDrawer.vue";
import { getRuleList, setRules } from "@/services/modules/rule";

const tableData = ref<IRoleItem[]>([]);
const ruleList = ref();
const currentPage = ref(1);
const totalCount = ref(0);
const isLoading = ref(false);

const setRuleFormDrawerRef = ref();
const treeHeight = ref(0);
const roleId = ref(0);
const defaultExpandedKeys = ref<number[]>([]);
const showRulesDrawer = ref(false);
const elTreeRef = ref();
// 当前角色拥有的权限ID
const ruleIds = ref<number[]>([]);
const checkStrictly = ref(false);

const {
  visible,
  title,
  openAdd,
  openEdit,
  form,
  rules,
  formDrawerRef,
  formRef,
  loading,
  submit,
} = useFormDrawer(
  {
    name: [{ required: true, message: "请输入角色昵称" }],
  },
  {
    name: "",
    desc: "",
    status: 1,
  },
  {
    createApi: createRole,
    updateApi: updateRole,
  },
  () => getTableData()
);

const getTableData = async () => {
  isLoading.value = true;

  const res = await getRoleList(currentPage.value);
  tableData.value = res.list;
  totalCount.value = res.totalCount;

  isLoading.value = false;
};
getTableData();

const handleDeleteRole = async (id: number) => {
  await deleteRole(id);
  toast("删除成功");
  getTableData();
};

const handleChangeStatus = async (id: number, status: number) => {
  isLoading.value = true;
  await updateRoleStatus(id, status);
  toast("修改成功");
  isLoading.value = false;
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const openSetRule = async (row: IRoleItem) => {
  roleId.value = row.id;
  treeHeight.value = window.innerHeight - 180;
  checkStrictly.value = true;

  getRuleList().then((res) => {
    ruleList.value = res.list;
    showRulesDrawer.value = true;
    defaultExpandedKeys.value = res.list.map((o) => o.id);

    // 当前角色拥有的权限ID
    ruleIds.value = row.rules.map((o) => o.id);
    setTimeout(() => {
      elTreeRef.value.setCheckedKeys(ruleIds.value);
      checkStrictly.value = false;
    }, 150);
  });
};

const handleSetRuleSubmit = async () => {
  loading.value = true;
  await setRules(roleId.value, ruleIds.value);
  toast("修改成功");
  getTableData();

  loading.value = false;
  showRulesDrawer.value = false;
};

const handleTreeCheck = (...e: any) => {
  const { checkedKeys, halfCheckedKeys } = e[1];
  ruleIds.value = [...checkedKeys, ...halfCheckedKeys];
};

watch(currentPage, () => {
  getTableData();
});
</script>

<style scoped></style>

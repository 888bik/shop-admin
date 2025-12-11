<template>
  <div class="access-page">
    <el-card shadow="never" class="border-0">
      <list-header @refresh="getRuleData" @add="openAdd" />
      <el-tree
        :data="listData"
        :props="{ label: 'name', children: 'child' }"
        v-loading="loading"
        node-key="id"
      >
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <el-tag size="small" :type="data.menu ? undefined : 'info'">{{
              data.menu ? "菜单" : "权限"
            }}</el-tag>
            <el-icon v-if="data.icon" :size="16" class="ml-2 mr-2">
              <component :is="data.icon" />
            </el-icon>
            <span>{{ data.name }}</span>

            <div class="ml-auto">
              <el-switch
                :modelValue="data.status"
                :active-value="1"
                :inactive-value="0"
                @click.stop
                @change="handleStatusChange($event, data)"
              />
              <el-button
                text
                type="primary"
                size="small"
                @click.stop="openEdit(data)"
                >修改</el-button
              >
              <el-button
                text
                type="primary"
                size="small"
                @click.stop="addChild(data.id)"
                >增加</el-button
              >

              <el-popconfirm
                title="是否要删除该记录？"
                confirmButtonText="确认"
                cancelButtonText="取消"
                @confirm.stop="handleDelete(data.id)"
              >
                <template #reference>
                  <el-button text type="primary" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </template>
      </el-tree>
    </el-card>

    <form-drawer
      :title="title"
      v-model="visible"
      ref="formDrawerRef"
      @submit="submit"
    >
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="80px"
        :inline="false"
      >
        <el-form-item label="上级菜单" prop="ruleId">
          <el-cascader
            v-model="form.ruleId"
            :options="rulesData"
            clearable
            :props="{
              value: 'id',
              label: 'name',
              children: 'child',
              checkStrictly: true,
              emitPath: false,
            }"
            placeholder="请选择上级菜单"
          />
        </el-form-item>
        <el-form-item label="菜单/规则" prop="menu">
          <el-radio-group v-model="form.menu">
            <el-radio :label="1" border>菜单</el-radio>
            <el-radio :label="0" border>规则</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="form.name"
            style="width: 30%"
            placeholder="名称"
          ></el-input
        ></el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-if="form.menu == 1">
          <IconSelect v-model="form.icon" />
        </el-form-item>
        <el-form-item
          label="前端路由"
          prop="frontpath"
          v-if="form.menu == 1 && form.ruleId > 0"
        >
          <el-input v-model="form.frontpath" placeholder="前端路由"></el-input>
        </el-form-item>
        <el-form-item label="后端规则" prop="condition" v-if="form.menu == 0">
          <el-input v-model="form.condition" placeholder="后端规则"></el-input>
        </el-form-item>
        <el-form-item label="请求方式" prop="method" v-if="form.menu == 0">
          <el-select v-model="form.method" placeholder="请选择请求方式">
            <el-option
              v-for="item in ['GET', 'POST', 'PUT', 'DELETE']"
              :key="item"
              :label="item"
              :value="item"
            /> </el-select
        ></el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="1000"
        /></el-form-item>
      </el-form>
    </form-drawer>
  </div>
</template>

<script setup lang="ts">
import { toast } from "@/assets/base-ui/toast";
import FormDrawer from "@/components/formDrawer.vue";
import IconSelect from "@/components/IconSelect.vue";
import ListHeader from "@/components/listHeader.vue";
import { useFormDrawer } from "@/hooks/useFormDrawer";
import {
  createRule,
  deleteRule,
  getRuleList,
  updateRule,
  updateRuleStatus,
} from "@/services/modules/rule";
import type { IRuleItem } from "@/services/modules/rule";
import { ref } from "vue";

const listData = ref<IRuleItem[]>();
const rulesData = ref<IRuleItem[]>();
const totalCount = ref<number>(0);

const loading = ref(false);

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
    ruleId: [{ required: true, message: "请选择上级菜单" }],
  },
  {
    ruleId: 0,
    menu: 0,
    name: "",
    condition: "",
    method: "GET",
    status: 1,
    order: 50,
    icon: "",
    frontpath: "",
  },
  {
    createApi: createRule,
    updateApi: updateRule,
  },
  () => getRuleData()
);

const getRuleData = async () => {
  loading.value = true;

  const res = await getRuleList();
  listData.value = res.list;
  rulesData.value = res.rules;
  totalCount.value = res.totalCount;

  loading.value = false;
};
getRuleData();

const handleDelete = async (id: number) => {
  loading.value = true;
  await deleteRule(id);
  getRuleData();
  toast("删除成功");
  loading.value = false;
};

const addChild = (id: number) => {
  openAdd();
  form.ruleId = id;
  form.status = 1;
};

const handleStatusChange = async (status: number, data: IRuleItem) => {
  loading.value = true;
  await updateRuleStatus(data.id, status);
  getRuleData();
  loading.value = false;
  toast("修改成功");
};
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
}
.el-tree-node__content {
  padding: 20px 0;
}
</style>

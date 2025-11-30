<template>
  <div class="access-page">
    <list-header @refresh="getRuleData" @add="" />
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
          <el-icon v-if="data.icon" :size="16" class="ml-2">
            <component :is="data.icon" />
          </el-icon>
          <span>{{ data.name }}</span>

          <div class="ml-auto">
            <el-switch
              :modelValue="data.status"
              :active-value="1"
              :inactive-value="0"
            />
            <el-button text type="primary" size="small">修改</el-button>
            <el-button text type="primary" size="small">增加</el-button>

            <el-popconfirm
              title="是否要删除该记录？"
              confirmButtonText="确认"
              cancelButtonText="取消"
            >
              <template #reference>
                <el-button text type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script setup lang="ts">
import ListHeader from "@/components/listHeader.vue";
import { getRuleList, type IRuleItem } from "@/services/modules/rule";
import { ref } from "vue";

const listData = ref<IRuleItem[]>();
const rulesData = ref<IRuleItem[]>();
const totalCount = ref<number>(0);

const loading = ref(false);

const getRuleData = async () => {
  loading.value = true;

  const res = await getRuleList();
  listData.value = res.list;
  rulesData.value = res.rules;
  totalCount.value = res.totalCount;

  loading.value = false;
};
getRuleData();
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

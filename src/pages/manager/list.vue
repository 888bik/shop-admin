<template>
  <div class="manager-page">
    <el-container class="bg-white">
      <el-header class="flex items-center justify-between border-b-1">
        <list-header @refresh="refreshData" @add="openAdd" />
      </el-header>

      <manager-table
        ref="managerTableRef"
        @set-roles="
            (res:any) => {
              roles = res;
            }
          "
        @edit="openEdit"
      />
    </el-container>

    <ManagerDrawer
      :roles="roles"
      :drawer-title="title"
      :avatar-url="imageUrl"
      v-model="visible"
      @change-dialog-visible="openSelector"
      @reload-data="refreshData"
      :edit-manager-data="editData!"
      :drawer-mode="mode"
    />

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
import { ref } from "vue";
import ManagerTable from "./cpns/manager-table.vue";
import ImageList from "@/pages/image/list.vue";
import ManagerDrawer from "./cpns/manager-drawer.vue";
import ListHeader from "@/components/listHeader.vue";

import type { IManagerItem, IRole } from "./type";
import { useFormDrawer } from "@/hooks/useFormDrawer";
import { useImageSelector } from "@/hooks/useImageSelector";

const { visible, title, mode, editData, openAdd, openEdit } =
  useFormDrawer<IManagerItem>();

const { dialogVisible, imageUrl, openSelector, handleSelect } =
  useImageSelector();

const roles = ref<IRole[]>();

const managerTableRef = ref();

const refreshData = () => {
  managerTableRef.value.getTableData();
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
</style>

<template>
  <div class="manager-page">
    <el-container class="bg-white">
      <el-header class="flex items-center justify-between border-b-1">
        <manager-header @refresh="refreshData" @add="openAddManagerDrawer" />
      </el-header>

      <manager-table
        ref="managerTableRef"
        @set-roles="
            (res:any) => {
              roles = res;
            }
          "
        @edit="openEditManagerDrawer"
      />
    </el-container>

    <ManagerDrawer
      :roles="roles"
      :drawer-title="drawerTitle"
      :avatar-url="avatarUrl"
      v-model="showDrawer"
      @change-dialog-visible="dialogFormVisible = true"
      @reload-data="refreshData"
      :edit-manager-data="editManagerData!"
      :drawer-mode="drawerMode"
    />

    <el-dialog
      v-model="dialogFormVisible"
      title="选择图片"
      width="80%"
      top="5vh"
      :close-on-click-modal="false"
    >
      <ImageList @select="handleSelectImage" :enable-preview="false" />

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ManagerFooter from "./cpns/manager-footer.vue";
import ManagerTable from "./cpns/manager-table.vue";
import ManagerHeader from "./cpns/manager-header.vue";
import ImageList from "@/pages/image/list.vue";
import ManagerDrawer from "./cpns/ManagerDrawer.vue";
import type { IManagerItem, IRole } from "./type";

const roles = ref<IRole[]>();

const managerTableRef = ref();

const avatarUrl = ref("");

const editManagerData = ref<IManagerItem>();

const showDrawer = ref(false);

const drawerMode = ref<"add" | "edit" | "delete">("add");

const drawerTitle = ref("");

const dialogFormVisible = ref(false);

const refreshData = () => {
  managerTableRef.value.getTableData();
};

const handleSelectImage = (url: string) => {
  avatarUrl.value = url;
  dialogFormVisible.value = false;
};

const openAddManagerDrawer = () => {
  drawerTitle.value = "新增";
  drawerMode.value = "add";
  showDrawer.value = true;
};

const openEditManagerDrawer = (data: IManagerItem) => {
  editManagerData.value = { ...data };
  drawerTitle.value = "修改";
  drawerMode.value = "edit";
  showDrawer.value = true;
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

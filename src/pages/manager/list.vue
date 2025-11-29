<template>
  <div class="manager-page">
    <el-container class="bg-white">
      <el-header class="flex items-center justify-between border-b-1">
        <!-- <notice-header @refresh="getTableData" @add="openAdd" /> -->
        <manager-header @refresh="getTableData" @add="showDrawer = true" />
      </el-header>

      <el-main>
        <!-- <notice-table
          :data="tableData"
          :loading="isLoading"
          @delete="handleDelete"
          @edit="handleEdit"
        /> -->
        <manager-table :data="tableData" />
      </el-main>

      <el-footer>
        <!-- <notice-footer
          :total="totalCount"
          :current-page="currentPage"
          @change="handlePageChange"
        /> -->
        <manager-footer />
      </el-footer>
    </el-container>

    <form-drawer
      :title="drawerTitle"
      ref="formDrawRef"
      :rules="rules"
      v-model="showDrawer"
      @close="showDrawer = false"
      @submit="onSubmit"
    >
      <el-form :model="form" ref="formRef" label-width="80px" :inline="false">
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
          <div class="avatar-picker" @click="dialogFormVisible = true">
            <el-icon :size="25" class="text-gray-500"><Plus /></el-icon>
          </div>
        </el-form-item>

        <el-form-item label="所属角色">
          <el-select v-model="form.role" placeholder="选择所属角色">
            <el-option
              :label="item.name"
              :value="item.name"
              v-for="(item, index) in roles"
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

    <el-dialog
      v-model="dialogFormVisible"
      title="选择图片"
      width="80%"
      top="5vh"
      :close-on-click-modal="false"
    >
      <el-container>
        <el-aside width="200px">
          <image-aside />
        </el-aside>
        <el-main>
          <image-content />
        </el-main>
      </el-container>
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
import { reactive, ref } from "vue";
import ManagerFooter from "./cpns/manager-footer.vue";
import ManagerTable from "./cpns/manager-table.vue";
import ManagerHeader from "./cpns/manager-header.vue";
import { getManagerList } from "@/services/modules/manager";
import ImageAside from "@/pages/image/cpns/image-aside.vue";
import ImageContent from "@/pages/image/cpns/image-content.vue";
import type { IManagerData, IManagerItem, IRole, RuleFormManger } from "./type";
import type { FormInstance, FormRules } from "element-plus";

const tableData = ref<IManagerItem[]>([]);
const currentPage = ref(1);
const totalCount = ref(0);
const isLoading = ref(false);
const limit = ref(10);
const roles = ref<IRole[]>();

const showDrawer = ref(false);
const formDrawRef = ref();
const formRef = ref<FormInstance>();
const form = reactive({
  username: "",
  password: "",
  avatar: "",
  role: "",
  status: 0,
});

const drawerMode = ref<"add" | "edit" | "delete">("add");

const drawerTitle = ref("");

const rules = reactive<FormRules<RuleFormManger>>({
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  password: [{ required: true, message: "密码不能为空", trigger: "blur" }],
  avatar: [{ required: true, message: "密码不能为空", trigger: "blur" }],
  role: [{ required: true, message: "密码不能为空", trigger: "blur" }],
});

const dialogFormVisible = ref(false);

const getTableData = async () => {
  const res: IManagerData = await getManagerList(
    currentPage.value,
    limit.value
  );
  tableData.value = res.list;
  totalCount.value = res.totalCount;
  roles.value = res.roles;
};
getTableData();

const onSubmit = () => {
  console.log(form);
  try {
    // const valid = await formRef.value?.validate();
    // if (!valid) registerRuntimeCompiler;
  } catch (error) {}
};
</script>

<style scoped>
.avatar-picker {
  @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:(bg-gray-100);
}
::v-deep(.el-dialog) {
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  margin: 0 !important;
}
</style>

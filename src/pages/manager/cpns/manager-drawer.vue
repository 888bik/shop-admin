<template>
  <form-drawer
    :title="drawerTitle"
    ref="formDrawRef"
    v-model="visible"
    @close="close"
    @submit="onSubmit"
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
        <el-input v-model="form.password" type="password" placeholder="密码" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <div @click="$emit('changeDialogVisible', true)">
          <template v-if="form.avatar">
            <el-image
              :src="form.avatar"
              fit="cover"
              style="width: 100px; height: 100px; border-radius: 4px"
            />
          </template>
          <template v-else>
            <div class="avatar-picker">
              <el-icon :size="25" class="text-gray-500"><Plus /></el-icon>
            </div>
          </template>
        </div>
      </el-form-item>

      <el-form-item label="所属角色">
        <el-select v-model="form.role" placeholder="选择所属角色">
          <el-option
            :label="item.name"
            :value="item.id"
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
</template>

<script setup lang="ts">
import { roleTypes, type FormInstance, type FormRules } from "element-plus";
import { computed, reactive, ref, watch } from "vue";
import type { IManagerItem, IRole, RuleFormManger } from "../type";
import { addManager, updateManager } from "@/services/modules/manager";
import { toast } from "@/assets/base-ui/toast";
import useUserStore from "@/store/modules/user";

interface FormDrawerProps {
  modelValue: boolean;
  roles: IRole[] | undefined;
  drawerTitle: string;
  avatarUrl: string;
  editManagerData?: IManagerItem;
  drawerMode: "add" | "edit" | "upload";
}
interface DrawerEmits {
  (e: "update:modelValue", FormDrawerVisible: boolean): void;
  (e: "reloadData"): void;
  (e: "changeDialogVisible", DialogVisible: boolean): void;
}

const props = defineProps<FormDrawerProps>();
const emit = defineEmits<DrawerEmits>();
const userStore = useUserStore();

const formDrawRef = ref();
const formRef = ref<FormInstance>();

const form = reactive({
  username: "",
  password: "",
  avatar: "",
  role: "",
  status: 0,
  roleId: 0,
});

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const rules = reactive<FormRules<RuleFormManger>>({
  username: [{ required: true, message: "用户名不能为空" }],
  password: [{ required: true, message: "密码不能为空" }],
  avatar: [{ required: true, message: "请选择头像" }],
  role: [{ required: true, message: "请选择角色" }],
});

watch(
  () => props.modelValue,
  (v) => (visible.value = v)
);
watch(
  () => props.avatarUrl,
  (v) => (form.avatar = v)
);
watch(
  () => props.editManagerData,
  () => {
    form.avatar = props.editManagerData?.avatar || "";
    form.role = "";
    form.roleId = props.editManagerData?.role.id || 0;
    form.status = props.editManagerData?.status || 0;
    form.username = props.editManagerData?.username || "";
  }
);

const close = () => {
  //重置表单
  resetForm();
  visible.value = false; // 自动触发 update:modelValue
};

const resetForm = () => {
  form.username = "";
  form.password = "";
  form.avatar = "";
  form.role = "";
  form.status = 0;
  form.roleId = 0;
  formRef.value?.clearValidate();
};

const onSubmit = async () => {
  try {
    await formRef.value?.validate();
    console.log(form.role);
    if (props.drawerMode === "add") {
      await addManager({
        username: form.username,
        password: form.password,
        roleId: form.role as unknown as number,
        status: form.status,
        avatar: form.avatar,
      });
      toast("添加成功");
    } else if (props.drawerMode === "edit") {
      console.log(form.role);
      updateManager({
        username: form.username,
        password: form.password,
        roleId: form.role as unknown as number,
        status: form.status,
        avatar: form.avatar,
        managerId: userStore.user!.id,
      });
      toast("修改成功");
    }
    visible.value = false;
    emit("reloadData");
  } catch (error: any) {
    toast("操作失败", error.msg, "error");
  }
};
</script>

<style scoped>
.avatar-picker {
  @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:(bg-gray-100);
}
</style>

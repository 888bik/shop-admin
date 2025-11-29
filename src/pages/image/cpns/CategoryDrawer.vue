<template>
  <form-drawer
    :title="drawerTitle"
    ref="formDrawRef"
    v-model="visible"
    @close="close"
    @submit="onSubmit"
  >
    <template v-if="drawerMode === 'add' || drawerMode === 'edit'">
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="80px"
        :inline="false"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="1000" />
        </el-form-item>
      </el-form>
    </template>
    <template v-else-if="drawerMode === 'upload'">
      <el-upload
        drag
        :http-request="handleUpload"
        multiple
        :headers="{ token }"
        name="img"
        :data="{ categoryId }"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            jpg/png files with a size less than 500kb
          </div>
        </template>
      </el-upload>
    </template>
  </form-drawer>
</template>

<script setup lang="ts">
import { toast } from "@/assets/base-ui/toast";
import {
  addImageCategory,
  editImageCategory,
  uploadImageFile,
} from "@/services/modules/image";
import { getToken } from "@/utils/auth";
import type { FormInstance } from "element-plus";
import { computed, reactive, ref, watch } from "vue";
import FormDrawer from "@/components/formDrawer.vue";

const token = getToken();

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  drawerTitle: { type: String, default: "" },
  drawerMode: { type: String, default: "" },
  categoryId: { type: Number },
  editData: { type: Object, default: null },
});

const emit = defineEmits(["update:modelValue", "reloadData"]);

const rules = {
  name: [
    {
      required: true,
      message: "图库分类名称不能为空",
      trigger: "blur",
    },
  ],
};

const form = reactive({
  name: "",
  order: 50,
});

const formRef = ref<FormInstance>();

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const handleUpload = async (option: any) => {
  const file = option.file;
  try {
    console.log(props.categoryId);
    await uploadImageFile(props.categoryId!, file);
    toast("上传成功");
    emit("reloadData","image");
    close();
  } catch {
    toast("上传失败", "", "error");
  }
};
watch(
  () => props.editData,
  (val) => {
    if (props.drawerMode === "edit" && val) {
      form.name = val.name;
      form.order = val.order;
    }
  },
  { immediate: true }
);
// 同步父到子
watch(
  () => props.modelValue,
  (v) => (visible.value = v)
);

// 同步子到父（抽屉关闭时会传 false）
const close = () => {
  visible.value = false; // 自动触发 update:modelValue
};

const onSubmit = async () => {
  if (props.drawerMode === "upload") return; // 上传无需提交按钮;

  try {
    const valid = await formRef.value?.validate();
    if (!valid) return;

    if (props.drawerTitle === "新增") {
      await addImageCategory(form.name, form.order);
      toast("添加分类成功");
    } else if (props.drawerTitle === "修改") {
      await editImageCategory(props.editData.id, form.name, form.order);
      toast("修改分类成功");
    }
    //重新加载数据
    emit("reloadData","category");
    close();
  } catch (error) {
    console.log("error", error);
  }
};
</script>

<style scoped></style>

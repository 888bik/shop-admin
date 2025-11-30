<template>
  <form-drawer
    :title="props.title"
    ref="formDrawRef"
    v-model="visible"
    @close="close"
    @submit="onSubmit"
  >
    <template v-if="mode === 'add' || mode === 'edit'">
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
    <template v-else-if="mode === 'upload'">
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
import { reactive, ref, watch } from "vue";
import FormDrawer from "@/components/formDrawer.vue";

interface IProps {
  modelValue: boolean;
  title: string;
  mode: "add" | "edit" | "upload";
  categoryId: number;
  editData: any | null;
}
const token = getToken("admin-token");

const props = defineProps<IProps>();
const emit = defineEmits(["update:modelValue", "reloadData"]);

const visible = ref(false);

watch(
  () => props.modelValue,
  (v) => (visible.value = v)
);
const close = () => emit("update:modelValue", false);

const form = reactive({
  name: "",
  order: 50,
});

const setForm = (data: any) => {
  form.name = data.name;
  form.order = data.order;
};

const rules = {
  name: [
    {
      required: true,
      message: "图库分类名称不能为空",
      trigger: "blur",
    },
  ],
};

const formRef = ref<FormInstance>();

// 自动回填
watch(
  () => props.editData,
  (v) => v && props.mode === "edit" && setForm(v),
  { immediate: true }
);

const handleUpload = async (option: any) => {
  const file = option.file;
  try {
    console.log(props.categoryId);
    await uploadImageFile(props.categoryId!, file);
    toast("上传成功");
    emit("reloadData", "image");
    close();
  } catch {
    toast("上传失败", "", "error");
  }
};

const onSubmit = async () => {
  if (props.mode === "upload") return;

  if (props.mode === "add") {
    await addImageCategory(form.name, form.order);
    toast("添加分类成功");
  }

  if (props.mode === "edit" && props.editData) {
    await editImageCategory(props.editData.id, form.name, form.order);
    toast("修改分类成功");
  }

  emit("reloadData", "category");
  close();
};
</script>

<style scoped></style>

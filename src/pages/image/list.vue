<template>
  <div class="image-page">
    <el-container class="bg-white" :style="{ height: h + 'px' }">
      <el-header class="image-header">
        <image-header
          @add="openAddCaDrawer"
          @upload-img="openUploadImgDrawer"
        ></image-header>
      </el-header>
      <el-container>
        <image-aside
          ref="imageAsideRef"
          @edit="openEditCaDrawer"
          @delete="handleDeleteCategory"
          @change="handleLoadImageList"
        ></image-aside>

        <image-content
          ref="imageContentRef"
          @edit="handleEditImage"
          @delete="handleDeleteImage"
        ></image-content>
      </el-container>
    </el-container>

    <form-drawer
      :title="drawerTitle"
      ref="formDrawRef"
      v-model="showDrawer"
      @close="showDrawer = false"
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
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import ImageAside from "./cpns/image-aside.vue";
import ImageContent from "./cpns/image-content.vue";
import ImageHeader from "./cpns/image-header.vue";
import type { FormInstance } from "element-plus";
import {
  addImageCategory,
  deleteImageById,
  deleteImageCategory,
  editImageCategory,
  editImageNameById,
  uploadImageFile,
} from "@/services/modules/image";
import { toast } from "@/assets/base-ui/toast";
import type { ICategoryItem } from "./type";
import { openMessageBox } from "@/assets/base-ui/messageBox";
import { getToken } from "@/utils/auth";

const windowHeight = window.innerHeight || document.body.clientHeight;
const h = windowHeight - 64 - 44 - 40;

const imageAsideRef = ref();
const showDrawer = ref(false);

const imageContentRef = ref();

const editId = ref();

const token = getToken();

const form = reactive({
  name: "",
  order: 50,
});

const drawerTitle = ref("");

const drawerMode = ref<"add" | "edit" | "upload">("add");

const rules = {
  name: [
    {
      required: true,
      message: "图库分类名称不能为空",
      trigger: "blur",
    },
  ],
};

const categoryId = ref(0);

const formRef = ref<FormInstance>();

const openAddCaDrawer = () => {
  drawerTitle.value = "新增";
  drawerMode.value = "add";
  showDrawer.value = true;
};

const openEditCaDrawer = (data: ICategoryItem) => {
  drawerTitle.value = "修改";
  drawerMode.value = "edit";
  // 数据回填
  form.name = data.name;
  form.order = data.order;
  editId.value = data.id;
  showDrawer.value = true;
};

const handleDeleteCategory = async (id: number) => {
  try {
    await deleteImageCategory(id);
    toast("删除分类成功");
    imageContentRef.value.loadImageList(categoryId.value);
  } catch (error) {
    toast("删除分类失败，请重新尝试", "", "error");
  }
  reloadCategoryList();
};

const handleEditImage = async (id: number) => {
  try {
    const NewName = await openMessageBox();
    if (!NewName) return;
    await editImageNameById(id, NewName);
    toast("图片修改成功");
    //重新加载
    imageContentRef.value.loadImageList(categoryId.value);
  } catch (error) {
    toast("图片修改失败，请重新尝试", "", "error");
  }
};

const handleDeleteImage = async (id: number) => {
  try {
    await deleteImageById([id]);
    toast("删除图片成功");
    //重新加载
    imageContentRef.value.loadImageList(categoryId.value);
  } catch (error) {
    toast("删除图片失败，请重新尝试", "", "error");
  }
};

const openUploadImgDrawer = (title: string) => {
  showDrawer.value = true;
  drawerMode.value = "upload";
  drawerTitle.value = title;
};

const handleUpload = async (option: any) => {
  const file = option.file;
  try {
    await uploadImageFile(categoryId.value, file);
    toast("上传成功");
    imageContentRef.value.loadImageList(categoryId.value);
    showDrawer.value = false;
  } catch {
    toast("上传失败", "", "error");
  }
};

const onSubmit = async () => {
  if (drawerMode.value === "upload") return; // 上传无需提交按钮;

  try {
    const valid = await formRef.value?.validate();
    if (!valid) return;

    if (drawerTitle.value === "新增") {
      await addImageCategory(form.name, form.order);
      toast("添加分类成功");
    } else if (drawerTitle.value === "修改") {
      await editImageCategory(editId.value, form.name, form.order);
      toast("修改分类成功");
    }

    //重新加载数据
    reloadCategoryList();
    showDrawer.value = false;
  } catch (error) {
    console.log("error", error);
  }
};

const reloadCategoryList = () => {
  if (!imageAsideRef) return;
  imageAsideRef.value.loadData(1);
};

const handleLoadImageList = (id: number) => {
  categoryId.value = id;
  if (!imageContentRef) return;
  imageContentRef.value.loadImageList(id);
};
</script>

<style scoped>
.image-header {
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}
</style>

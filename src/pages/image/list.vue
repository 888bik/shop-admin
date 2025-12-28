<template>
  <div class="image-page">
    <el-container class="bg-white" :style="{ height: h + 'px' }">
      <el-header class="image-header">
        <image-header
          @add-category="openAdd"
          @upload-img="uploadImageVisible = true"
        />
      </el-header>
      <el-container>
        <image-aside
          ref="imageAsideRef"
          @change-category="(id:number) => (categoryId = id)"
          @edit-category="openEdit"
        />

        <image-content
          ref="imageContentRef"
          :category-id="categoryId"
          :enable-preview="enablePreview"
          :selectable="isSelectable"
          :multiple="multiple"
          @select="handleSelect"
        />
      </el-container>
    </el-container>

    <form-drawer
      :title="title"
      ref="formDrawerRef"
      v-model="visible"
      @submit="submit"
    >
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
    </form-drawer>

    <form-drawer
      title="上传"
      ref="uploadImageDrawerRef"
      v-model="uploadImageVisible"
      :hideBtn="true"
    >
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
    </form-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ImageAside from "./cpns/image-aside.vue";
import ImageContent from "./cpns/image-content.vue";
import ImageHeader from "./cpns/image-header.vue";
import { useFormDrawer } from "@/hooks/useFormDrawer";
import { getToken } from "@/utils/auth";
import {
  createImageCategory,
  updateImageCategory,
  uploadImageFile,
} from "@/services/modules/image";
import { toast } from "@/assets/base-ui/toast";
import FormDrawer from "@/components/formDrawer.vue";

interface IProps {
  //开启预览,图库模块正常模式开启
  enablePreview?: boolean;
  //选择模式
  isSelectable?: boolean;
  //在选择模式下是否开启多选模式
  multiple?: boolean;
}

const {
  enablePreview = true,
  multiple = false,
  isSelectable = false,
} = defineProps<IProps>();

const emit = defineEmits(["select"]);

const windowHeight = window.innerHeight || document.body.clientHeight;
const h = windowHeight - 64 - 44 - 40;

const token = getToken("accessToken");

const uploadImageVisible = ref(false);
const uploadImageDrawerRef = ref(null);

const imageAsideRef = ref();
const imageContentRef = ref();

const categoryId = ref(0);

const {
  visible,
  title,
  openAdd,
  openEdit,
  form,
  rules,
  submit,
  formRef,
  formDrawerRef,
} = useFormDrawer(
  {
    name: [{ required: true, message: "图库分类名称不能为空" }],
  },
  {
    name: "",
    order: 50,
  },
  {
    createApi: createImageCategory,
    updateApi: updateImageCategory,
  },
  () => reloadData("category")
);

const handleUpload = async (option: any) => {
  const file = option.file;
  try {
    await uploadImageFile(categoryId.value, file);
    toast("上传成功");
    reloadData("image");
    uploadImageVisible.value = false;
  } catch {
    toast("上传失败", "", "error");
  }
};

const reloadData = (e: string) => {
  if (e === "image") {
    imageContentRef.value.loadImageList();
  } else if (e === "category") {
    imageAsideRef.value.loadCategoryList();
  }
};

const handleSelect = (item: any) => {
  emit("select", item);
};
</script>

<style scoped>
.image-header {
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}
</style>

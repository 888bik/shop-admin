<template>
  <div class="image-page">
    <el-container class="bg-white" :style="{ height: h + 'px' }">
      <el-header class="image-header">
        <image-header
          @add-category="openAddCategoryDrawer"
          @upload-img="openUploadImgDrawer"
        />
      </el-header>
      <el-container>
        <image-aside
          ref="imageAsideRef"
          @change-category="(id) => (categoryId = id)"
          @edit-category="openEditCategoryDrawer"
        />

        <image-content
          ref="imageContentRef"
          :category-id="categoryId"
          :enable-preview="enablePreview"
          @select="handleSelect"
        />
      </el-container>
    </el-container>

    <category-drawer
      v-model="showDrawer"
      :drawer-mode="drawerMode"
      :drawer-title="drawerTitle"
      @reload-data="reloadCategoryList"
      :edit-category-data="editCategoryData"
      :category-id="categoryId"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ImageAside from "./cpns/image-aside.vue";
import ImageContent from "./cpns/image-content.vue";
import ImageHeader from "./cpns/image-header.vue";
import CategoryDrawer from "./cpns/CategoryDrawer.vue";
import type { ICategoryItem } from "./type";

const props = defineProps({
  enablePreview: { type: Boolean, default: true },
});
const emit = defineEmits(["select"]);

const windowHeight = window.innerHeight || document.body.clientHeight;
const h = windowHeight - 64 - 44 - 40;

const imageAsideRef = ref();
const showDrawer = ref(false);
const imageContentRef = ref();

const categoryId = ref(0);
const editCategoryData = ref<ICategoryItem>();
const drawerTitle = ref("");

const drawerMode = ref<"add" | "edit" | "upload">("add");

const openAddCategoryDrawer = () => {
  showDrawer.value = true;
  drawerTitle.value = "新增";
  drawerMode.value = "add";
};

const openUploadImgDrawer = () => {
  showDrawer.value = true;
  drawerMode.value = "upload";
  drawerTitle.value = "上传图片";
};

const openEditCategoryDrawer = (data: ICategoryItem) => {
  drawerTitle.value = "修改";
  drawerMode.value = "edit";
  // 数据回填
  editCategoryData.value = { ...data };
  showDrawer.value = true;
};

const reloadCategoryList = (e: string) => {
  if (e === "image") {
    imageContentRef.value.loadImageList();
  } else if (e === "category") {
    imageAsideRef.value.loadCategoryList();
  }
};

const handleSelect = (item: any) => {
  emit("select", item.url);
};
</script>

<style scoped>
.image-header {
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}
</style>

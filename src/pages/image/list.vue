<template>
  <div class="image-page">
    <el-container class="bg-white" :style="{ height: h + 'px' }">
      <el-header class="image-header">
        <image-header @add-category="openAdd" @upload-img="openUpload" />
      </el-header>
      <el-container>
        <image-aside
          ref="imageAsideRef"
          @change-category="(id) => (categoryId = id)"
          @edit-category="handleEditCategory"
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
      v-model="visible"
      :title="title"
      :mode="mode"
      @reload-data="reloadCategoryList"
      :category-id="categoryId"
      :edit-data="editData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ImageAside from "./cpns/image-aside.vue";
import ImageContent from "./cpns/image-content.vue";
import ImageHeader from "./cpns/image-header.vue";
import CategoryDrawer from "./cpns/image-drawer.vue";
import type { ICategoryItem } from "./type";
import { useFormDrawer } from "@/hooks/useFormDrawer";

const props = defineProps({
  enablePreview: { type: Boolean, default: true },
});

const emit = defineEmits(["select"]);

const windowHeight = window.innerHeight || document.body.clientHeight;
const h = windowHeight - 64 - 44 - 40;

const { visible, title, mode, editData, openAdd, openEdit, openUpload, close } =
  useFormDrawer<ICategoryItem>();

const imageAsideRef = ref();
const imageContentRef = ref();

const categoryId = ref(0);

const reloadCategoryList = (e: string) => {
  if (e === "image") {
    imageContentRef.value.loadImageList();
  } else if (e === "category") {
    imageAsideRef.value.loadCategoryList();
  }
};

const handleEditCategory = (item: ICategoryItem) => {
  openEdit(item, "修改分类");
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

<template>
  <el-aside width="200px" class="relative" v-loading="isLoading">
    <div class="image-aside">
      <div
        v-for="(item, index) in imageCategoryData"
        :key="item.id"
        class="category-list"
        :class="{ active: activeId === item.id }"
        @click="handleSelected(item.id)"
      >
        <span class="truncate">
          {{ item.name }}
        </span>
        <div class="btn-group">
          <el-button
            class="editBtn"
            text
            type="primary"
            size="small"
            @click.stop="handleEditCategory(item)"
          >
            <el-icon :size="12"><Edit /></el-icon>
          </el-button>
          <el-button
            text
            class="deleteBtn"
            type="primary"
            size="small"
            @click.stop="handleDeleteCategory(item.id)"
          >
            <el-icon :size="12"><Close /></el-icon>
          </el-button>
        </div>
      </div>
    </div>
    <div class="bottom">
      <el-pagination
        background
        layout="prev, next"
        :total="totalCount"
        :page-size="limit"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
    </div>
  </el-aside>
</template>

<script setup lang="ts">
import {
  deleteImageCategory,
  getImageCategoryList,
} from "@/services/modules/image";
import { ref } from "vue";
import type { ICategoryItem, IImageCategory, IImageList } from "../type";
import { toast } from "@/assets/base-ui/toast";

const emit = defineEmits<{
  (e: "changeCategory", id: number): void;
  (e: "editCategory", data: any): void;
  (e: "deleteCategory", id: number): void;
}>();

const imageCategoryData = ref<ICategoryItem[]>([]);

const currentPage = ref(1);
const totalCount = ref(0);
const limit = ref(10);

const isLoading = ref(false);

const activeId = ref<number>(0);

const handlePageChange = async (page: number) => {
  loadCategoryList(page);
};

const handleSelected = (id: number) => {
  activeId.value = id;
  emit("changeCategory", id);
};

const handleEditCategory = (item: ICategoryItem) => {
  const { id, name, order } = item;
  emit("editCategory", { id, name, order });
};

const loadCategoryList = async (page = currentPage.value) => {
  isLoading.value = true;
  try {
    const res: IImageCategory = await getImageCategoryList(page, limit.value);
    imageCategoryData.value = res.list;
    totalCount.value = res.totalCount;
    currentPage.value = page;

    if (activeId.value === 0 && res.list.length > 0) {
      activeId.value = res.list[0]!.id;
      emit("changeCategory", activeId.value);
    }
  } finally {
    isLoading.value = false;
  }
};

loadCategoryList();

const handleDeleteCategory = async (id: number) => {
  try {
    await deleteImageCategory(id);
    toast("删除分类成功");
  } catch (error) {
    toast("删除分类失败，请重新尝试", "", "error");
  }
  loadCategoryList();
};

defineExpose({
  loadCategoryList,
});
</script>

<style scoped>
.image-aside {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}
.bottom {
  position: absolute;
  bottom: 0;
  height: 50px;
  left: 0;
  right: 0;
  @apply flex items-center justify-center;
}
.category-list {
  border-bottom: 1px solid #f4f4f4;
  cursor: pointer;
  @apply flex items-center justify-between px-3 py-3;
}
.category-list:hover {
  @apply bg-blue-50;
}
.active {
  @apply bg-blue-50;
}
.category-list .editBtn {
  @apply px-1;
}
.category-list .deleteBtn {
  @apply px-1;
}
</style>

<template>
  <el-main class="relative" v-loading="isLoading">
    <div class="image-content">
      <el-row :gutter="10" class="px-2">
        <el-col
          :span="6"
          v-for="(item, index) in ImageListData"
          :key="item.id"
          class="mt-3"
        >
          <div class="relative group card-wrapper">
            <el-image
              class="card-cover w-full h-38 object-cover cursor-pointer"
              :src="item.url"
              :preview-src-list="[item.url]"
              fit="cover"
            />

            <!-- 悬浮图标按钮 -->
            <div
              class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition duration-200"
            >
              <el-button
                size="small"
                circle
                @click.stop="$emit('edit', item.id)"
              >
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button
                size="small"
                circle
                @click.stop="$emit('delete', item.id)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
          <!-- 标题 -->
          <div class="px-3 py-2 font-semibold truncate">{{ item.name }}</div>
        </el-col>
      </el-row>
    </div>
    <div class="bottom">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="currentPage"
        :total="totalCount"
        @current-change="handlePageChange"
      />
    </div>
  </el-main>
</template>

<script setup lang="ts">
import { getImageListById } from "@/services/modules/image";
import { ref, watch } from "vue";
import type { IImageItem, IImageList } from "../type";

const currentPage = ref(1);
const limit = ref(10);

const isLoading = ref(false);

const ImageListData = ref<IImageItem[]>([]);
const totalCount = ref<number>(0);
// 用来保存当前分类 ID
const categoryId = ref<number | null>(null);

const loadImageList = async (id?: number) => {
  if (id) {
    categoryId.value = id; //缓存id
    currentPage.value = 1; //切换分页从第一页开始加载
  }

  if (!categoryId.value) return;

  isLoading.value = true;

  const res: IImageList = await getImageListById(
    categoryId.value,
    currentPage.value,
    limit.value
  );

  ImageListData.value = res.list;
  totalCount.value = res.totalCount;
  isLoading.value = false;
};

loadImageList();

watch(currentPage, () => {
  loadImageList();
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};
defineExpose({
  loadImageList,
});
</script>

<style scoped>
.image-content {
  position: absolute;
  top: 0;
  bottom: 50px;
  left: 0;
  right: 0;
  overflow-y: auto;
}
.bottom {
  position: absolute;
  height: 50px;
  left: 0;
  bottom: 0;
  right: 0;
  @apply flex items-center justify-center;
}
.card-wrapper {
  @apply rounded-xl overflow-hidden shadow transition-all duration-300 bg-white;
}

.card-wrapper:hover {
  @apply shadow-xl -translate-y-1 scale-130;
}
</style>

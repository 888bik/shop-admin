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
              :preview-src-list="enablePreview ? [item.url] : []"
              fit="cover"
              @click.stop="handleSelect(item)"
            />

            <!-- 悬浮图标按钮 -->
            <div
              class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition duration-200"
            >
              <el-button
                size="small"
                circle
                @click.stop="handleEditImage(item.id)"
              >
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button
                size="small"
                circle
                @click.stop="handleDeleteImage(item.id)"
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
import {
  deleteImageById,
  editImageNameById,
  getImageListById,
} from "@/services/modules/image";
import { ref, watch } from "vue";
import type { IImageItem, IImageList } from "../type";
import { openMessageBox } from "@/assets/base-ui/messageBox";
import { toast } from "@/assets/base-ui/toast";

const props = defineProps({
  enablePreview: { type: Boolean, default: true }, // 控制是否预览
  categoryId: { type: Number, default: 0 },
});

const emit = defineEmits(["select", "editSuccess", "delete"]);

const currentPage = ref(1);
const limit = ref(10);
const isLoading = ref(false);

const ImageListData = ref<IImageItem[]>([]);
const totalCount = ref<number>(0);
// 用来保存当前分类 ID
const categoryId = ref<number | null>(0);

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
// 监听 categoryId 变化自动刷新
watch(
  () => props.categoryId,
  (newId) => {
    loadImageList(newId);
  }
);

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const handleEditImage = async (id: number) => {
  try {
    const NewName = await openMessageBox();
    if (!NewName) return;
    await editImageNameById(id, NewName);
    toast("图片修改成功");
    //重新加载
    loadImageList();
  } catch (error) {
    toast("图片修改失败，请重新尝试", "", "error");
  }
};

const handleDeleteImage = async (id: number) => {
  try {
    await deleteImageById([id]);
    toast("删除图片成功");
    //重新加载
    loadImageList();
  } catch (error) {
    toast("删除图片失败，请重新尝试", "", "error");
  }
};

const handleSelect = (item: any) => {
  if (!props.enablePreview) {
    emit("select", item); // 返回选中的图片
  }
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

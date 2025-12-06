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
          <div
            class="relative group card-wrapper"
            :class="{ selected: selectedIds.includes(item.id) }"
          >
            <!-- 注意：不要使用 .stop，这样 enablePreview 为 true 的时候 el-image 自带预览可工作 -->
            <el-image
              class="card-cover w-full h-38 object-cover cursor-pointer"
              :src="item.url"
              :preview-src-list="!selectable && enablePreview ? [item.url] : []"
              fit="cover"
              @click="onCardClick(item)"
            />

            <!-- 悬浮图标按钮（保持原有功能） -->
            <div
              class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition duration-200"
            >
              <el-button
                size="small"
                circle
                @click.stop="handleEditImageName(item.id)"
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

            <!-- 选择标记（勾）-->
            <div
              v-if="selectable"
              class="select-badge absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition"
            >
              <el-icon
                class="badge-icon"
                @click.stop="toggleSelect(item)"
                :title="selectedIds.includes(item.id) ? '取消选择' : '选择'"
              >
                <Check />
              </el-icon>
            </div>

            <!-- 选中遮罩（始终显示当已选中） -->
            <div v-if="selectedIds.includes(item.id)" class="selected-overlay">
              <div class="checkmark">
                <el-icon><Check /></el-icon>
              </div>
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
  deleteImage,
  getImageList,
  updateImageName,
} from "@/services/modules/image";
import { ref, watch } from "vue";
import type { IImageItem, IImageList } from "../type";
import { openMessageBox } from "@/assets/base-ui/messageBox";
import { toast } from "@/assets/base-ui/toast";

const props = defineProps({
  enablePreview: { type: Boolean, default: true },
  categoryId: { type: Number, default: 0 },
  // 新增选择相关 props
  selectable: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  // 可传入初始已选 ids（可选）
  initialSelectedIds: { type: Array as () => number[], default: () => [] },
});

const emit = defineEmits(["select", "editSuccess", "delete"]);

const currentPage = ref(1);
const limit = ref(10);
const isLoading = ref(false);

const ImageListData = ref<IImageItem[]>([]);
const totalCount = ref<number>(0);

// 用来保存当前分类 ID
const localCategoryId = ref<number | null>(0);

// 选中 id 列表
const selectedIds = ref<number[]>([...props.initialSelectedIds]);

const loadImageList = async (id?: number) => {
  if (id) {
    localCategoryId.value = id; //缓存id
    currentPage.value = 1; //切换分页从第一页开始加载
  }

  if (!localCategoryId.value) {
    ImageListData.value = [];
    totalCount.value = 0;
    return;
  }

  isLoading.value = true;

  const res: IImageList = await getImageList(
    localCategoryId.value,
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

// 监听 props.categoryId 变化自动刷新
watch(
  () => props.categoryId,
  (newId) => {
    loadImageList(newId);
  }
);

// 当父级传入 initialSelectedIds 时，初始化 selectedIds
watch(
  () => props.initialSelectedIds,
  (ids) => {
    selectedIds.value = [...(ids || [])];
  },
  { immediate: true }
);

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const handleEditImageName = async (id: number) => {
  try {
    const NewName = await openMessageBox();
    if (!NewName) return;
    await updateImageName(id, NewName);
    toast("修改成功");
    //重新加载
    loadImageList();
    emit("editSuccess", id);
  } catch (error) {
    toast("修改失败，请重新尝试", "", "error");
  }
};

const handleDeleteImage = async (id: number) => {
  try {
    await deleteImage([id]);
    toast("删除片成功");
    //重新加载
    loadImageList();
    emit("delete", id);
  } catch (error) {
    toast("删除失败，请重新尝试", "", "error");
  }
};

// 点击图片卡片（入口）
const onCardClick = (item: IImageItem) => {
  // 如果处于可选择模式，走选择逻辑
  if (props.selectable) {
    toggleSelect(item);
    return;
  }

  // 非选择模式：
  // 如果 enablePreview 为 false，则作为单次选择，直接 emit select
  if (!props.enablePreview) {
    emit("select", item);
    return;
  }

  // enablePreview 为 true 且非 selectable：什么也不做（el-image 自带预览）
  // 允许 el-image 自己处理预览
};

// 切换选择（用于勾选 icon 或点击卡片时）
const toggleSelect = (item: IImageItem) => {
  const idx = selectedIds.value.indexOf(item.id);

  // 多选模式
  if (props.multiple) {
    if (idx === -1) selectedIds.value.push(item.id);
    else selectedIds.value.splice(idx, 1);

    // === 关键：组装并 emit 选中的图片对象数组 ===
    const selectedItems = ImageListData.value.filter((img) =>
      selectedIds.value.includes(img.id)
    );
    emit("select", selectedItems);
    return;
  }

  // 单选模式
  if (idx === -1) selectedIds.value = [item.id];
  else selectedIds.value = [];

  const selectedItem = ImageListData.value.find((img) =>
    selectedIds.value.includes(img.id)
  );
  console.log(selectedItem);
  emit("select", selectedItem ?? null);
};

defineExpose({
  loadImageList,
  // 让外部可以读取或设置 selectedIds 如果需要
  selectedIds,
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
  position: relative;
  overflow: hidden;
}

/* hover 效果保持 */
.card-wrapper:hover {
  @apply shadow-xl -translate-y-1 scale-105;
}

/* 选中态样式：高亮边框 & 半透明遮罩 */
.card-wrapper.selected {
  box-shadow: 0 8px 20px rgba(18, 93, 255, 0.12);
  transform: translateY(-4px) scale(1.02);
  border: 2px solid rgba(18, 93, 255, 0.25);
}

/* 半透明遮罩覆盖，并居中勾 */
.selected-overlay {
  position: absolute;
  inset: 0;
  background: rgba(18, 93, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.selected-overlay .checkmark {
  background: white;
  border-radius: 999px;
  padding: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* 勾选按钮小徽章 */
.select-badge .badge-icon {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 999px;
  padding: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>

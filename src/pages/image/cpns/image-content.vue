<template>
  <el-main class="relative">
    <div class="image-content" v-loading="isLoading">
      <el-empty v-if="!ImageListData.length" description="暂无数据" />
      <el-row :gutter="10" class="px-2" v-else>
        <el-col
          :span="6"
          v-for="(item, index) in ImageListData"
          :key="item.id"
          class="mt-3"
        >
          <div class="relative group card-wrapper h-38">
            <el-image
              class="card-cover w-full h-full object-cover cursor-pointer"
              :src="item.url"
              :preview-src-list="!selectable && enablePreview ? [item.url] : []"
              fit="cover"
              @click="onCardClick(item)"
            />

            <!-- 悬浮图标按钮 -->
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

            <!-- 选中遮罩（始终显示当已选中） -->
            <div
              v-if="selectedIds.includes(item.id) && !enablePreview"
              class="selected-overlay"
            >
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

interface IProps {
  enablePreview: boolean;
  categoryId: number;
  multiple: boolean;
  initialSelectedIds: any;
}

const props = defineProps({
  enablePreview: { type: Boolean, default: true },
  categoryId: { type: Number, default: 0 },
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

// 当前分类选中列表，界面绑定
const selectedIds = ref<number[]>([...props.initialSelectedIds]);

const selectedItemsAll = ref<IImageItem[]>([]);

const loadImageList = async (id?: number) => {
  if (id != undefined) {
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
// 父组件传入 initialSelectedIds 时同步
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
    const newName = await openMessageBox();
    if (!newName) return;
    await updateImageName(id, newName);
    toast("修改成功");
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

// 点击图片卡片
const onCardClick = (item: IImageItem) => {
  // 如果处于可选择模式，走选择逻辑
  if (props.selectable) {
    toggleSelect(item);
    return;
  }
  // 非选择模式：
  // 如果 enablePreview 为 false，则作为单次选择，直接 emit select
  if (!props.enablePreview) {
    emit("select", item.url);
    return;
  }
};

// 切换选择（用于勾选 icon 或点击卡片时）
const toggleSelect = (item: IImageItem) => {
  //选中的图片id
  const idx = selectedIds.value.indexOf(item.id);

  // 多选模式
  if (props.multiple) {
    if (idx === -1) {
      selectedIds.value.push(item.id);

      if (!selectedItemsAll.value.find((img) => img.id === item.id)) {
        selectedItemsAll.value.push(item);
      }
    } else {
      selectedIds.value.splice(idx, 1);

      const removeIndex = selectedItemsAll.value.findIndex(
        (img) => img.id === item.id
      );
      if (removeIndex !== -1) {
        selectedItemsAll.value.splice(removeIndex, 1);
      }
    }

    emit("select", selectedItemsAll.value);
    return;
  }

  // 单选模式
  if (idx === -1) selectedIds.value = [item.id];
  else selectedIds.value = [];

  // selectedMap.value[cid] = [...selectedIds.value];

  const selectedItem = ImageListData.value.find((img) =>
    selectedIds.value.includes(img.id)
  );
  emit("select", selectedItem?.url ?? null);
};

defineExpose({
  loadImageList,
  selectedIds,
  // selectedMap,
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
  overflow-x: hidden;
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

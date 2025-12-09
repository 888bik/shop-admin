<template>
  <div>
    <div class="trigger" @click="openDialog">
      <!-- 多选展示缩略图 -->
      <template v-if="multiple && Array.isArray(selected) && selected.length">
        <div class="thumbs">
          <el-image
            v-for="(url, i) in selectedUrls.slice(0, 5)"
            :key="i"
            :src="url"
            fit="cover"
            class="thumb !w-[100px] !h-[100px]"
          />

          <!-- <div v-if="selectedUrls.length > 5" class="thumb-more">
            +{{ selectedUrls.length - 5 }}
          </div> -->

          <div class="avatar-picker avatar-picker--small" title="添加图片">
            <el-icon :size="35"><Plus /></el-icon>
          </div>
        </div>
      </template>

      <!-- 单选展示 -->
      <template v-else>
        <template v-if="singleUrl">
          <el-image :src="singleUrl" fit="cover" class="single-thumb" />
        </template>
        <template v-else>
          <div class="avatar-picker" title="选择图片">
            <el-icon :size="35"><Plus /></el-icon>
          </div>
        </template>
      </template>
    </div>

    <!-- Dialog -->
    <el-dialog
      v-model="visible"
      title="选择图片"
      width="80%"
      top="5vh"
      :close-on-click-modal="false"
      destroy-on-close
      class="image-picker-dialog"
    >
      <Image-list
        ref="listRef"
        :enable-preview="false"
        :is-selectable="true"
        :multiple="multiple"
        :initial-selected-ids="initialSelectedIds"
        @select="onSelect"
      />

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import ImageList from "@/pages/image/list.vue";
import { Plus } from "@element-plus/icons-vue";

interface IProps {
  modelValue: any;
  multiple: boolean;
  limit?: number;
  initialSelectedIds?: number[];
}

const {
  modelValue,
  multiple,
  limit = 10,
  initialSelectedIds = [],
} = defineProps<IProps>();

const emit = defineEmits(["update:modelValue", "confirm"]);

const visible = ref<boolean>(false);

const selected = ref<any>(multiple ? [] : null);

const normalizeModelToSelected = (mv: any) => {
  if (multiple) {
    if (!mv) return [];
    if (Array.isArray(mv)) return mv;
    return [mv];
  } else {
    return mv ?? null;
  }
};
selected.value = normalizeModelToSelected(modelValue);

watch(
  () => modelValue,
  (v) => {
    selected.value = normalizeModelToSelected(v);
  }
);

const selectedUrls = computed<string[]>(() => {
  if (!multiple) return [];
  const arr = Array.isArray(selected.value) ? selected.value : [];
  return arr.map((it: any) => (typeof it === "string" ? it : it?.url || ""));
});

const singleUrl = computed<string | null>(() => {
  if (multiple) return null;
  const it = selected.value;
  if (!it) return null;
  return typeof it === "string" ? it : it?.url || null;
});

const onSelect = (payload: any) => {
  if (multiple) {
    selected.value = Array.isArray(payload)
      ? payload
      : payload
      ? [payload]
      : [];
  } else {
    selected.value = payload ?? null;
  }
  if (!multiple) handleConfirm();
};

const openDialog = () => {
  visible.value = true;
};

const closeDialog = () => {
  visible.value = false;
};

const handleConfirm = () => {
  emit("update:modelValue", selected.value);
  emit("confirm", selected.value);
  visible.value = false;
};

defineExpose({
  openDialog,
  closeDialog,
  confirm: handleConfirm,
});
</script>

<style scoped>
:root {
  --picker-size: 100px;
  --thumb-size: 60px;
  --radius: 8px;
  --border: 1px dashed #e6e6e6;
  --shadow: 0 6px 18px rgba(31, 41, 55, 0.08);
  --muted: #8b8b8b;
  --accent-1: linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%);
}

.trigger {
  display: inline-block;
}

/* thumbs area: responsive grid */
.thumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  max-width: calc(100px * 3 + 12px * 2);
}

.thumb {
  width: var(--thumb-size);
  height: var(--thumb-size);
  border-radius: 6px;
  object-fit: cover;
  box-shadow: var(--shadow);
  transition: transform 180ms ease, box-shadow 180ms ease;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.04);
}
.thumb:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 14px 30px rgba(31, 41, 55, 0.12);
}

.thumb-more {
  width: var(--thumb-size);
  height: var(--thumb-size);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.02));
  color: var(--muted);
  font-weight: 600;
  border: 1px dashed rgba(0, 0, 0, 0.06);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

/* avatar picker (big) */
.avatar-picker {
  height: 100px;
  width: 100px;
  border-radius: var(--radius);
  border: var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.9),
    rgba(250, 250, 250, 0.9)
  );
  transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
  cursor: pointer;
  box-shadow: var(--shadow);
}

.avatar-picker--small {
  width: 100px;
  height: 100px;
  border-radius: 6px;
}

.avatar-picker:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(31, 41, 55, 0.12);
  background: var(--accent-1);
  /* color: white; */
}

.single-thumb {
  width: 100px;
  height: 100px;
  border-radius: var(--radius);
  object-fit: cover;
  box-shadow: var(--shadow);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

/* dialog footer */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 0;
}

/* dialog tweaks */
.image-picker-dialog .el-dialog__header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.image-picker-dialog .el-dialog__body {
  padding: 16px 24px;
}

/* small screens adjustments */
@media (max-width: 600px) {
  :root {
    --picker-size: 84px;
    --thumb-size: 52px;
  }
  .thumbs {
    max-width: 320px;
  }
  .image-picker-dialog {
    width: 95% !important;
    top: 3vh !important;
  }
}
</style>

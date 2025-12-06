<template>
  <div>
    <div class="trigger" @click="openDialog">
      <!-- 多选展示缩略图 -->
      <template v-if="multiple && Array.isArray(selected) && selected.length">
        <div class="thumbs">
          <el-image
            v-for="(url, i) in selectedUrls"
            :key="i"
            :src="url"
            fit="cover"
            class="thumb"
          />
          <div v-if="selectedUrls.length > 5" class="thumb-more">
            +{{ selectedUrls.length - 5 }}
          </div>
        </div>
      </template>

      <!-- 单选展示 -->
      <template v-else>
        <template v-if="singleUrl">
          <el-image :src="singleUrl" fit="cover" class="single-thumb" />
        </template>
        <template v-else>
          <div class="avatar-picker">
            <el-icon :size="25"><Plus /></el-icon>
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

// props
// const props = defineProps({
//   // 已选图片（外部绑定）
//   modelValue: { type: [String, Array, Object, null] as any, default: null },
//   // 控制弹窗显示（独立于 modelValue）
//   visible: { type: Boolean, default: false },

//   multiple: { type: Boolean, default: false },
//   limit: { type: Number, default: 9 },
//   showTrigger: { type: Boolean, default: true },
//   categoryId: { type: Number, default: 0 },
//   initialSelectedIds: { type: Array as () => number[], default: () => [] },
//   title: { type: String, default: "选择图片" },
// });

const emit = defineEmits(["update:modelValue", "confirm"]);

const visible = ref<boolean>();

// watch(localVisible, (v) => emit("update:visible", v));

// internal selected（存储已选内容）
// - multiple => array of objects or strings
// - single => object or string or null
const selected = ref<any>(multiple ? [] : null);

// 初始化 selected 来自 modelValue
const normalizeModelToSelected = (mv: any) => {
  if (multiple) {
    if (!mv) return [];
    if (Array.isArray(mv)) return mv;
    // 如果外部给的是单个值，包成数组
    return [mv];
  } else {
    return mv ?? null;
  }
};
selected.value = normalizeModelToSelected(modelValue);

// 当外部 modelValue 改变时同步内部 selected
watch(
  () => modelValue,
  (v) => {
    selected.value = normalizeModelToSelected(v);
  }
);

// 方便渲染：取出 url 字符串（支持 item 为 string 或 {url,...}）
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

// 当 image-list 选中时（image-list 在选择时会 emit 对象或对象数组）
// 直接把 payload 存入 selected（父组件上 next 会在确认时接收）
const onSelect = (payload: any) => {
  // payload 可能是 object | [] | url-string
  if (multiple) {
    selected.value = Array.isArray(payload)
      ? payload
      : payload
      ? [payload]
      : [];
  } else {
    selected.value = payload ?? null;
  }
  // 单选立即确认,返回图片并关闭dialog
  if (!multiple) handleConfirm();
};

const openDialog = () => {
  visible.value = true;
};

const closeDialog = () => {
  visible.value = false;
};

// 把 selected 同步到外部 modelValue 并 emit confirm
const handleConfirm = () => {
  // 直接把 selected.value 发给外部）
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
.avatar-picker {
  width: 100px;
  height: 100px;
  border-radius: 6px;
  border: 1px dashed #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: center;
}
.single-thumb {
  width: 100px;
  height: 100px;
  border-radius: 6px;
  object-fit: cover;
}
.thumbs {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
.thumb {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
}
.thumb-more {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #666;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 0;
}
</style>

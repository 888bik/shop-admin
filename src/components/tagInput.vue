<template>
  <el-tag
    v-for="tag in dynamicTags"
    :key="tag"
    class="mx-1"
    closable
    :disable-transitions="false"
    @close="handleClose(tag)"
  >
    {{ tag }}
  </el-tag>
  <el-input
    v-if="inputVisible"
    ref="InputRef"
    v-model="inputValue"
    class="ml-1 w-20"
    size="small"
    @keyup.enter="handleInputConfirm"
    @blur="handleInputConfirm"
  />
  <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
    + 添加值
  </el-button>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";

interface IProps {
  modelValue: any;
}

const props = defineProps<IProps>();

const emit = defineEmits(["update:modelValue"]);

const inputValue = ref("");
const dynamicTags = ref(props.modelValue ? props.modelValue.split(",") : []);

const inputVisible = ref(false);
const InputRef = ref();

watch(
  () => props.modelValue,
  (v) => {
    dynamicTags.value = v ? v.split(",") : [];
  }
);

const handleClose = (tag: any) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
  emit("update:modelValue", dynamicTags.value.join(","));
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value?.input.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value);
    emit("update:modelValue", dynamicTags.value.join(","));
  }
  inputVisible.value = false;
  inputValue.value = "";
};
</script>

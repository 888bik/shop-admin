<template>
  <div v-loading="loading">
    <el-tag
      v-for="(tag, index) in skuCardItem?.goodsSkusCardValue"
      :key="index"
      closable
      :disable-transitions="false"
      class="mx-1"
      effect="plain"
      @close="handleClose(tag)"
    >
      <el-input
        v-model="tag.text"
        placeholder="选项值"
        size="small"
        class="!w-20 ml-[-10px]"
        @change="handleChange($event, tag)"
      ></el-input>
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="!w-20 ml-1"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button v-else class="button-new-tag" size="small" @click="showInput">
      添加选项值
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { initSkuCardItemValue } from "@/hooks/useSkus";

interface IProps {
  id: number;
}

const { id } = defineProps<IProps>();

const {
  skuCardItem,
  inputVisible,
  inputValue,
  handleInputConfirm,
  showInput,
  InputRef,
  handleChange,
  handleClose,
  loading,
} = initSkuCardItemValue(id);
</script>

<style scoped></style>

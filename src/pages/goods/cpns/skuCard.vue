<template>
  <el-form-item label="规格选项" v-loading="">
    <el-card
      shadow="never"
      class="w-full mb-3"
      v-for="(item, index) in skuCardList"
      :key="item.id"
      v-loading="item.loading"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <div class="input">
            <el-input
              v-model="item.text"
              placeholder="规格名称"
              style="width: 200px"
              @change="handleUpdate(item)"
            >
              <template #append>
                <el-icon><more /></el-icon>
              </template>
            </el-input>
          </div>
          <div class="btn">
            <el-button
              class="ml-auto"
              size="small"
              @click="moveUp(index)"
              :disabled="index == 0"
              ><el-icon><Top /></el-icon
            ></el-button>

            <el-button
              size="small"
              @click="moveDown(index)"
              :disabled="index === skuCardList.length - 1"
              ><el-icon><Bottom /></el-icon
            ></el-button>

            <el-popconfirm
              title="是否要删除该选项？"
              confirmButtonText="确认"
              cancelButtonText="取消"
              @confirm="handleDelete(item)"
            >
              <template #reference>
                <el-button size="small"
                  ><el-icon><Delete /></el-icon
                ></el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>

      <SkuCardItem :id="item.id" />
    </el-card>
    <el-button
      type="success"
      size="small"
      @click="handleCreate"
      v-loading="btnLoading"
      >添加规格选项</el-button
    >
  </el-form-item>
</template>

<script setup lang="ts">
import {
  handleDelete,
  skuCardList,
  handleCreate,
  handleUpdate,
  btnLoading,
  moveDown,
  moveUp,
} from "@/hooks/useSkus";
import SkuCardItem from "./skuCardItem.vue";
</script>

<style scoped></style>

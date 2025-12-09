<template>
  <el-form-item label="规格选项" v-loading="bodyLoading">
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
                <el-tooltip effect="dark" content="设置规格">
                  <el-icon
                    @click="handleSelectSkus(item)"
                    class="cursor-pointer"
                    ><more
                  /></el-icon>
                </el-tooltip>
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

  <SkusSelect ref="SkusSelectRef" />
</template>

<script setup lang="ts">
import {
  handleDelete,
  skuCardList,
  handleCreate,
  handleUpdate,
  btnLoading,
  bodyLoading,
  moveDown,
  moveUp,
  handleChooseSetGoodsSkusCard,
} from "@/hooks/useSkus";
import SkuCardItem from "./skuCardItem.vue";
import SkusSelect from "@/components/skusSelect.vue";
import { ref } from "vue";

const SkusSelectRef = ref();

const handleSelectSkus = (item: any) => {
  SkusSelectRef?.value.open((form: any) => {
    handleChooseSetGoodsSkusCard(item.id, {
      name: form.name,
      value: form.value,
    });
  });
};
</script>

<style scoped></style>

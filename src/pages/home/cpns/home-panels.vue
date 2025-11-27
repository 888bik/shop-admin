<template>
  <el-row :gutter="20">
    <!-- 骨架屏显示 -->
    <template v-if="panelsData.length == 0">
      <el-col :span="6" v-for="i in 4" :key="i">
        <el-skeleton style="width: 100%" animated loading>
          <template #template>
            <el-card shadow="hover" class="border-0">
              <template #header>
                <div class="header" style="height: 35px">
                  <el-skeleton-item variant="text" style="width: 50%" />
                  <el-skeleton-item variant="text" style="width: 10%" />
                </div>
              </template>
              <div class="center">
                <el-skeleton-item
                  variant="h3"
                  style="width: 100%; height: 35px"
                />
                <el-divider />
              </div>
              <div class="bottom">
                <el-skeleton-item variant="text" style="width: 50%" />
                <el-skeleton-item variant="text" style="width: 10%" />
              </div>
            </el-card>
          </template>
        </el-skeleton>
      </el-col>
    </template>

    <el-col
      :span="6"
      v-for="(item, index) in panelsData"
      :offset="0"
      :key="index"
    >
      <el-card shadow="hover" class="border-0">
        <div class="header">
          <span class="title">
            {{ item.title }}
          </span>
          <el-tag :type="item.unitColor || undefined" effect="plain">
            {{ item.unit }}
          </el-tag>
        </div>

        <div class="center">
          <el-divider />
          <CountScroll :value="item.value"></CountScroll>
          <el-divider />
        </div>
        <div class="bottom">
          <span>{{ item.subTitle }}</span>
          <span> {{ item.subValue }}</span>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { getStatistics1 } from "@/services/modules/statistics";
import { onMounted, ref } from "vue";
import type { IPanels } from ".././type";
import CountScroll from "@/components/countScroll.vue";

let panelsData = ref<IPanels[]>([]);

onMounted(async () => {
  try {
    const res = await getStatistics1();
    panelsData.value = res.panels;
  } catch (error) {
    console.log(error);
  }
});
</script>

<style scoped>
.header {
  @apply flex justify-between items-center text-sm;
}

.center {
  @apply text-3xl font-bold text-gray-500;
}

.bottom {
  @apply flex justify-between items-center text-sm text-gray-500;
}
</style>

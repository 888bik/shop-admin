<template>
  <el-drawer title="物流信息" v-model="dialogVisible" size="40%">
    <el-card shadow="never" class="border-0 mb-3">
      <div class="flex items-center">
        <!-- <el-image
          :src="info.logo"
          fit="fill"
          :lazy="true"
          style="width: 60px; height: 60px"
          class="rounded border"
        ></el-image> -->
        <div class="ml-3">
          <p>物流公司：{{ info?.company.name }}</p>
          <p>物流单号：{{ info?.trackingNo }}</p>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" class="border-0 border-t">
      <div v-for="(item, index) in sortedHistory" :key="index" class="mb-2">
        <div class="text-sm text-gray-500">{{ item.time }}</div>
        <div class="text-base">
          【{{ statusMap[item.status] || item.status }}】{{ item.desc }}
          <span v-if="item.location">（{{ item.location }}）</span>
        </div>
      </div>
    </el-card>
  </el-drawer>
</template>

<script setup lang="ts">
import { toast } from "@/assets/base-ui/toast";
import { getShipData, type ShipDataResponse } from "@/services/modules/orders";
import { ref, computed } from "vue";

const dialogVisible = ref(false);
const info = ref<ShipDataResponse>();

const open = async (id: number) => {
  try {
    const res = await getShipData(id);
    info.value = res;
    dialogVisible.value = true;
  } catch (error) {
    toast("获取物流信息失败", "", "error");
  }
};

const statusMap: Record<string, string> = {
  PICKED: "已揽收",
  DEPARTED: "已离开",
  ARRIVED: "已到达",
  OUT_FOR_DELIVERY: "派送中",
  IN_STORAGE: "已暂存",
  SIGNED: "已签收",
};

// 按时间升序排列（从上到下显示）
const sortedHistory = computed(() => {
  if (!info.value?.history) return [];
  return [...info.value.history].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );
});

defineExpose({
  open,
});
</script>

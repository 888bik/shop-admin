<template>
  <el-drawer title="订单详情" v-model="dialogVisible" size="50%">
    <el-card shadow="never" class="mb-3">
      <template #header>
        <b class="text-sm">订单详情</b>
      </template>
      <el-form label-width="80px">
        <el-form-item label="订单号">
          {{ detailInfo?.orderNo }}
        </el-form-item>
        <el-form-item label="付款方式">
          {{ detailInfo?.paymentMethod ?? "暂未支付" }}
        </el-form-item>
        <el-form-item label="付款时间">
          {{ detailInfo?.paidTime ?? "暂未支付" }}
        </el-form-item>
        <el-form-item label="创建时间">
          {{ timeUtils.format(detailInfo?.createTime) }}
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-if="detailInfo?.shipData" shadow="never" class="mb-3">
      <template #header>
        <b class="text-sm">发货信息</b>
      </template>
      <el-form label-width="80px">
        <el-form-item label="物流公司">
          {{ detailInfo.shipData.company.name }}
        </el-form-item>
        <el-form-item label="运单号">
          {{ detailInfo.shipData.trackingNo }}
          <el-button
            type="primary"
            text
            size="small"
            @click="openShipInfoModal(detailInfo.id)"
            class="ml-3"
            :loading="loading"
            >查看物流</el-button
          >
        </el-form-item>
        <el-form-item label="发货时间">
          {{ timeUtils.format(detailInfo.shipData.shippedTime) }}
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mb-3">
      <template #header>
        <b class="text-sm">商品信息</b>
      </template>
      <div
        class="flex mb-2"
        v-for="(item, index) in detailInfo?.items"
        :key="index"
      >
        <el-image
          :src="item.goodsCover ?? ''"
          fit="fill"
          :lazy="true"
          style="width: 60px; height: 60px"
        ></el-image>
        <div class="ml-2 text-sm">
          <p>{{ item.goodsTitle ?? "商品已被删除" }}</p>
          <p v-if="item?.goodsSkus" class="mt-1">
            <el-tag type="info" size="small">
              {{ item?.goodsSkus }}
            </el-tag>
          </p>
          <p>
            <b class="text-rose-500 mr-2">￥{{ item.price }}</b>
            <span class="text-xs text-gray-500">x{{ item.num }}</span>
          </p>
        </div>
      </div>
      <el-form label-width="80px">
        <el-form-item label="成交价">
          <span class="text-rose-500 font-bold"
            >￥{{ detailInfo?.totalPrice }}</span
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" v-if="detailInfo?.address" class="mb-3">
      <template #header>
        <b class="text-sm">收货信息</b>
      </template>
      <el-form label-width="80px">
        <el-form-item label="收货人">
          {{ detailInfo.address.name }}
        </el-form-item>
        <el-form-item label="联系方式">
          {{ detailInfo.address.phone }}
        </el-form-item>
        <el-form-item label="收货地址">
          {{
            [
              detailInfo.address.province,
              detailInfo.address.city,
              detailInfo.address.district,
              detailInfo.address.address,
            ]
              .filter(Boolean)
              .join("")
          }}
        </el-form-item>
      </el-form>
    </el-card>

    <el-card
      shadow="never"
      v-if="
        ['pending', 'agreed', 'returning', 'returned'].includes(
          detailInfo?.refundStatus || ''
        )
      "
    >
      <template #header>
        <b class="text-sm">退款信息</b>
        <el-button text disabled style="float: right">{{
          formatRefundStatus
        }}</el-button>
      </template>
      <el-form label-width="80px">
        <el-form-item label="退款理由">
          {{ detailInfo?.extra.refund.applyReason || "-" }}
        </el-form-item>
      </el-form>
      <el-form-item label="退款单号" v-if="detailInfo?.refundNo">
        {{ detailInfo.refundNo }}
      </el-form-item>

      <el-form-item label="退款时间">
        {{
          detailInfo?.extra.refund.applyTime
            ? timeUtils.format(detailInfo.extra.refund.applyTime)
            : "-"
        }}
      </el-form-item>
    </el-card>
  </el-drawer>

  <ShipInfoModal ref="ShipInfoModalRef" />
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import type { IOrderItem } from "@/services/modules/orders";
import { timeUtils } from "@/utils/date";
import ShipInfoModal from "./ShipInfoModal.vue";
interface IProps {
  detailInfo: IOrderItem | null;
}
const { detailInfo } = defineProps<IProps>();

const ShipInfoModalRef = ref();
const loading = ref(false);
const dialogVisible = ref(false);

const formatRefundStatus = computed(() => {
  const map: Record<string, string> = {
    none: "未退款",
    pending: "已申请，等待审核",
    agreed: "已同意，等待退货",
    returning: "用户已寄回",
    returned: "已退货",
    rejected: "已拒绝",
    completed: "退款完成",
  };
  const code = detailInfo?.refundStatus ?? "none";
  return map[code] ?? code;
});

const openShipInfoModal = (id: number) => {
  loading.value = true;
  ShipInfoModalRef.value.open(id).finally(() => (loading.value = false));
};

const open = () => {
  dialogVisible.value = true;
};

defineExpose({
  open,
});
</script>

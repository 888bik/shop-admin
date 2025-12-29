<template>
  <div class="orders-page">
    <el-tabs v-model="searchQuery.tab">
      <el-tab-pane
        v-for="(item, index) in tabBarData"
        :label="item.name"
        :name="item.key"
      ></el-tab-pane>
    </el-tabs>

    <el-card shadow="never" class="border-0">
      <SearchInput
        v-model="searchQuery"
        :fields="searchFields"
        @search="onSearch"
      >
      </SearchInput>
      <ListHeader @refresh="getTableData" :layout="['refresh']">
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(multiSelectionIds)"
          v-if="searchQuery.tab != 'delete'"
          >批量删除</el-button
        >
      </ListHeader>

      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="tableLoading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="订单信息" width="320">
          <template #default="{ row }">
            <div class="order-info">
              <p class="text-sm font-medium mb-1 px-2 py-1 bg-blue-50 rounded">
                订单号：<span class="text-blue-600">{{ row.orderNo }}</span>
              </p>

              <p class="text-gray-600 text-xs mb-1 px-2 py-1 rounded">
                下单时间：{{ timeUtils.format(row.createTime) }}
              </p>

              <p
                class="text-gray-700 text-xs mb-1 px-2 py-1 bg-green-50 rounded"
              >
                收货人：{{ row.address?.name }} {{ row.address?.phone }}
              </p>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="订单商品" width="240">
          <template #default="{ row }">
            <div
              v-for="item in row.items"
              :key="item.goodsId"
              class="flex mb-2 last:mb-0"
            >
              <el-image
                :src="item.goodsCover"
                fit="cover"
                style="width: 48px; height: 48px"
                class="mr-2 rounded"
              />
              <div class="flex-1 text-sm">
                <p class="line-clamp-1">{{ item.goodsTitle }}</p>
                <p class="text-gray-400 text-xs">
                  ￥{{ item.price }} × {{ item.num }}
                </p>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="实付金额"
          align="center"
          width="110"
          prop="saleCount"
        >
          <template #default="{ row }">
            <p class="text-red-500 font-semibold">￥{{ row.totalPrice }}</p>
            <p class="text-gray-400 text-xs">含运费 ￥{{ row.shippingFee }}</p>
          </template>
        </el-table-column>

        <el-table-column label="买家" align="center" width="150">
          <template #default="{ row }">
            <div class="flex items-center justify-center">
              <el-image
                :src="row.user.avatar"
                style="width: 30px; height: 30px"
                fit="cover"
                class="rounded-full mr-2"
              />
              <span>{{ row.user.nickname || row.user.username }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="交易状态" align="center" width="130">
          <template #default="{ row }">
            <el-tag v-if="row.refundStatus === 'pending'" type="warning"
              >退款申请中</el-tag
            >
            <el-tag v-else-if="row.refundStatus === 'agreed'" type="info"
              >等待退货</el-tag
            >
            <el-tag
              v-else-if="row.refundStatus === 'return_requested'"
              type="info"
              >用户已申请退货</el-tag
            >

            <el-tag v-else-if="row.refundStatus === 'returning'" type="info"
              >用户已寄回</el-tag
            >
            <el-tag v-else-if="row.refundStatus === 'returned'" type="info"
              >已退货</el-tag
            >
            <el-tag v-else-if="row.refundStatus === 'completed'" type="success"
              >已退款</el-tag
            >
            <el-tag v-else-if="row.refundStatus === 'rejected'" type="danger"
              >已拒绝退款</el-tag
            >

            <!-- 支付状态 -->
            <el-tag
              v-if="row.payStatus === 'unpaid'"
              type="warning"
              class="mb-1"
              >待支付</el-tag
            >
            <el-tag
              v-else-if="row.payStatus === 'paid'"
              type="success"
              class="mb-1"
              >已支付：{{ formatPaymentMethodText(row.paymentMethod) }}</el-tag
            >

            <!-- 发货状态 -->
            <el-tag
              v-if="
                row.refundStatus === 'none' &&
                row.shipStatus === 'pending ' &&
                row.payStatus === 'paid'
              "
              type="info"
              >待发货</el-tag
            >
            <el-tag
              v-else-if="
                row.refundStatus === 'none' && row.shipStatus === 'shipped'
              "
              type="primary"
              >待收货</el-tag
            >
            <el-tag
              v-else-if="
                row.refundStatus === 'none' && row.shipStatus === 'received'
              "
              type="success"
              >已收货</el-tag
            >

            <el-tag v-if="row.closed" type="danger" class="mt-1">已关闭</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button
              size="small"
              text
              type="primary"
              @click="openInfoModal(row)"
            >
              订单详情
            </el-button>

            <el-button
              v-if="
                row.payStatus === 'paid' &&
                row.shipStatus === 'pending' &&
                row.refundStatus !== 'pending'
              "
              size="small"
              text
              type="success"
              @click="openShipModal(row)"
            >
              发货
            </el-button>

            <el-button
              v-if="
                row.refundStatus === 'pending' && row.shipStatus === 'pending'
              "
              size="small"
              text
              type="primary"
              @click="handleRefund(row, true)"
            >
              同意退款
            </el-button>

            <el-button
              v-if="
                row.refundStatus === 'pending' && row.shipStatus === 'pending'
              "
              size="small"
              text
              type="primary"
              @click="handleRefund(row, false)"
            >
              拒绝退款
            </el-button>

            <el-button
              v-if="row.refundStatus === 'return_requested'"
              size="small"
              text
              type="primary"
              @click="handleRefund(row, true)"
            >
              同意用户退货
            </el-button>

            <el-button
              v-if="row.refundStatus === 'return_requested'"
              size="small"
              text
              type="danger"
              @click="handleRefund(row, false)"
            >
              拒绝用户退货
            </el-button>

            <el-button
              v-if="row.refundStatus === 'returning'"
              size="small"
              text
              type="success"
              @click="confirmReturn(row.id)"
            >
              确认退货并退款
            </el-button>

            <el-button
              v-if="row.refundStatus === 'returning'"
              size="small"
              text
              type="danger"
              @click="rejectedReturn(row.id)"
            >
              拒绝退货退款
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex items-center justify-center mt-4">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalCount"
          :current-page="currentPage"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <InfoModal ref="InfoModalRef" :detail-info="detailInfo" />
    <ShipModal
      ref="ShipModalRef"
      :companies-data="companiesData"
      @shipped="getTableData"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, toRaw, watch } from "vue";
import ListHeader from "@/components/listHeader.vue";
import SearchInput from "@/components/searchInput.vue";
import { useTable } from "@/hooks/useTable";
import { timeUtils } from "@/utils/date";
import {
  confirmReturnRefund,
  deleteOrder,
  getOrdersList,
  refundOrder,
  rejectedReturnRefund,
  type IOrderItem,
} from "@/services/modules/orders";
import InfoModal from "./cpns/OrderInfoModal.vue";
import ShipModal from "./cpns/ShipModal.vue";
import { getCompanies, type ICompaniesItem } from "@/services/modules/express";
import { showModal } from "@/assets/base-ui/showModal";
import { showPrompt } from "@/assets/base-ui/showPrompt";
import { toast } from "@/assets/base-ui/toast";

const searchQuery = reactive({
  tab: "all",
  no: "",
  name: "",
  phone: "",
});

const searchFields = computed(() => [
  {
    type: "input" as "input",
    label: "订单编号",
    model: "no",
    placeholder: "订单编号",
    prefixIcon: "search",
  },

  {
    type: "input" as "input",
    label: "手机号码",
    model: "phone",
    placeholder: "手机号码",
    prefixIcon: "search",
  },
  {
    type: "input" as "input",
    label: "收货人",
    model: "name",
    placeholder: "收货人",
    prefixIcon: "search",
  },
]);

const detailInfo = ref<IOrderItem | null>(null);
const InfoModalRef = ref<InstanceType<typeof InfoModal>>();
const ShipModalRef = ref<InstanceType<typeof ShipModal>>();

const companiesData = ref<ICompaniesItem[]>([]);
const {
  tableData,
  tableLoading,
  currentPage,
  totalCount,
  query,
  getTableData,
  handleDelete,
  handleSelectionChange,
  handlePageChange,
  multiSelectionIds,
} = useTable<IOrderItem>({
  listApi: (page, limit, query) =>
    getOrdersList(page, limit, {
      tab: query.tab,
      no: query.no,
      phone: query.phone,
    }),
  deleteApi: deleteOrder,
  pageSize: 10,
  initialQuery: { tab: "all" },
});

watch(
  () => searchQuery.tab,
  (v) => {
    query.value.tab = v;
    getTableData(1); //切换标签后刷新第一页
  }
);

const init = async () => {
  await getTableData();
  companiesData.value = await getCompanies();
};
init();

const openInfoModal = (row: IOrderItem) => {
  const detail = structuredClone(toRaw(row)) as IOrderItem & {
    paymentMethodText?: string;
  };
  detail.paymentMethodText = formatPaymentMethodText(detail.paymentMethod);
  detailInfo.value = detail;
  InfoModalRef.value?.open?.();
};

const openShipModal = (row: IOrderItem) => {
  ShipModalRef.value?.open?.(
    row.id,
    row.extra.shipping as {
      type: "standard" | "express";
      name: string;
      fee: number;
    },
    row.payStatus,
    row.shipStatus
  );
};

const onSearch = (form: any) => {
  const cleanQuery: any = {};

  Object.keys(form).forEach((key) => {
    const value = form[key];
    if (value !== "" && value !== null && value !== undefined) {
      cleanQuery[key] = value;
    }
  });

  query.value = {
    ...query.value,
    ...cleanQuery,
  };
  getTableData(1);
};

// 处理退款/退货操作
const handleRefund = async (row: IOrderItem, agree: boolean) => {
  // 判断退款类型
  let refundType: "only_refund" | "return_refund" = "only_refund";

  if (row.refundStatus === "pending" && row.shipStatus === "pending") {
    // 用户未发货申请退款 → 仅退款
    refundType = "only_refund";
  } else if (
    row.refundStatus === "return_requested" &&
    row.shipStatus === "received"
  ) {
    // 用户已收货申请退货 → 退货退款
    refundType = "return_refund";
  } else {
    return toast("当前订单不支持该操作");
  }

  const msg = agree
    ? refundType === "only_refund"
      ? "是否同意该订单退款？"
      : "是否同意用户退货申请？"
    : "请输入拒绝退款/退货的理由";

  try {
    const { value = "" } = agree ? await showModal(msg) : await showPrompt(msg);

    await refundOrder({
      orderId: row.id,
      agree,
      reason: value,
      refundType,
    });

    toast("操作成功");
    getTableData();
  } catch (err) {}
};

//确认退货并退款
const confirmReturn = (orderId: number) => {
  showModal("确认已收到退货并退款？")
    .then(async () => {
      await confirmReturnRefund(orderId);
      toast("退款完成");
      getTableData();
    })
    .catch(() => {});
};

const rejectedReturn = async (orderId: number) => {
  try {
    // 弹出输入框让管理员填写拒绝理由
    const { value: reason = "" } = await showPrompt("请输入拒绝退款的理由");

    if (!reason) {
      return toast("请填写拒绝理由");
    }

    await rejectedReturnRefund(orderId, reason);

    toast("已拒绝退款");
    getTableData();
  } catch {}
};

const formatPaymentMethodText = (method: string | null) => {
  if (!method) return "未知方式";
  const upperMethod = method.toUpperCase();

  const map: Record<string, string> = {
    WECHAT: "微信支付",
    ALIPAY: "支付宝",
  };

  return map[upperMethod] ?? method;
};

const tabBarData = [
  {
    key: "all",
    name: "全部",
  },
  {
    key: "nopay",
    name: "待支付",
  },
  {
    key: "noship",
    name: "待发货",
  },
  {
    key: "shipped",
    name: "待收货",
  },
  {
    key: "received",
    name: "已收货",
  },
  {
    key: "closed",
    name: "已关闭",
  },
  {
    key: "refunding",
    name: "退款中",
  },
];
</script>

<style scoped></style>
<!-- | 步骤       | 状态变化                           |
| -------- | ------------------------------ |
| 用户申请退款   | refundStatus = `pending`       |
| 管理员同意    | refundStatus = `agreed`        |
| 用户填写退货单号 | refundStatus = `returning` |
| 管理员确认收货  | refundStatus = `completed`     | -->

<!-- | refundStatus | 管理员看到 | 操作      |
| ------------ | ----- | ------- |
| pending      | 退款申请中 | 同意 / 拒绝 |
| agreed       | 等待退货  | 确认收到退货  |
| completed    | 已退款   | 只读      |
| rejected     | 已拒绝   | 只读      | -->

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
        <el-table-column label="订单信息" width="350">
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

        <el-table-column label="订单商品" width="260">
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
          width="120"
          prop="saleCount"
        >
          <template #default="{ row }">
            <p class="text-red-500 font-semibold">￥{{ row.totalPrice }}</p>
            <p class="text-gray-400 text-xs">含运费 ￥{{ row.shippingFee }}</p>
          </template>
        </el-table-column>

        <el-table-column label="买家" align="center">
          <template #default="{ row }">
            <div class="flex items-center">
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
            <!-- 支付状态 -->
            <el-tag
              v-if="row.payStatus === 'pending'"
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
              v-if="row.shipStatus === 'pending' && row.payStatus === 'paid'"
              type="info"
              >待发货</el-tag
            >
            <el-tag v-else-if="row.shipStatus === 'shipped'" type="primary"
              >已发货</el-tag
            >
            <el-tag v-else-if="row.shipStatus === 'received'" type="success"
              >已完成</el-tag
            >

            <!-- 关闭状态 -->
            <el-tag v-if="row.closed" type="danger" class="mt-1">已关闭</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="140">
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
              v-if="row.payStatus === 'paid' && row.shipStatus === 'pending'"
              size="small"
              text
              type="success"
              @click="openShipModal(row)"
            >
              发货
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
    <ShipModal ref="ShipModalRef" :companies-data="companiesData" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, toRaw, watch } from "vue";
import ListHeader from "@/components/listHeader.vue";
import SearchInput from "@/components/searchInput.vue";
import { useTable } from "@/hooks/useTable";
import { timeUtils } from "@/utils/date";
import { getOrdersList, type IOrderItem } from "@/services/modules/orders";
import InfoModal from "./cpns/OrderInfoModal.vue";
import ShipModal from "./cpns/ShipModal.vue";
import { getCompanies, type ICompaniesItem } from "@/services/modules/express";
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
  pageSize: 10,
  initialQuery: { tab: "all" },
});

watch(
  () => searchQuery.tab,
  (v) => {
    query.value.tab = v;
    console.log(query.value.tab);
    getTableData(1); //切换标签后刷新第一页
  }
);

const init = async () => {
  await getTableData();
  const res = await getCompanies();
  companiesData.value = res;
};
init();

const openInfoModal = (row: IOrderItem) => {
  const detail = structuredClone(toRaw(row)) as IOrderItem & {
    paymentMethodText?: string;
  };
  detail.paymentMethodText = formatPaymentMethodText(detail.paymentMethod);
  detailInfo.value = detail;
  InfoModalRef.value?.open();
};

const openShipModal = (row: IOrderItem) => {
  ShipModalRef.value?.open(
    row.orderId,
    row.extra.shipping,
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
    key: "shiped",
    name: "待收货",
  },
  {
    key: "received",
    name: "已收货",
  },
  {
    key: "finish",
    name: "已完成",
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

<template>
  <el-dialog :title="'订单发货'" width="500px" v-model="dialogVisible">
    <el-form :model="form" label-width="100px">
      <el-form-item label="快递公司">
        <el-select
          v-model="form.expressCompanyId"
          placeholder="选择快递公司"
          @change="handleCompanyChange"
        >
          <el-option
            v-for="item in filteredCompanies"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="快递单号">
        <el-input v-model="form.expressNo" placeholder="填写快递单号" />
        <el-button
          type="primary"
          size="small"
          @click="generateExpressNo"
          style="margin-top: 5px"
        >
          随机生成
        </el-button>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submit" :loading="loading"
        >确认发货</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { toast } from "@/assets/base-ui/toast";
import type { ICompaniesItem } from "@/services/modules/express";
import { shipOrder } from "@/services/modules/orders";
import { ref, reactive, computed } from "vue";

interface IProps {
  companiesData: ICompaniesItem[];
}

// 父组件传入的公司列表
const emit = defineEmits();
const props = defineProps<IProps>();

const dialogVisible = ref(false);
const shippingType = ref<"standard" | "express">("standard");
const currentOrderId = ref();
const loading = ref(false);

const form = reactive({
  expressCompanyId: null,
  expressCompany: "",
  expressNo: "",
});

// 打开发货 modal
const open = (
  orderId: number,
  shipping: { type: "standard" | "express"; name: string; fee: number },
  payStatus: string,
  shipStatus: string
) => {
  // 校验订单状态
  if (payStatus !== "paid") {
    return toast("订单未支付，不能发货", "", "error");
  }
  if (shipStatus !== "pending") {
    return toast("订单已发货，不能重复发货", "", "error");
  }

  form.expressCompany = "";
  form.expressNo = "";
  form.expressCompanyId = null;
  currentOrderId.value = orderId;
  shippingType.value = shipping.type;
  dialogVisible.value = true;
};

// 根据配送类型过滤快递公司
const filteredCompanies = computed(() => {
  if (shippingType.value === "express") {
    return props.companiesData.filter((c) => c.code === "shunfeng");
  }
  return props.companiesData;
});

// 生成快递单号
const generateExpressNo = () => {
  if (!form.expressCompanyId) return alert("请先选择快递公司");
  const company = props.companiesData.find(
    (c) => c.id === form.expressCompanyId
  );
  if (!company) return;

  const prefix = company.code.toUpperCase();
  const timestamp = Date.now().toString().slice(-10);
  const randomNum = Math.floor(Math.random() * 9000 + 1000);
  form.expressNo = `${prefix}${timestamp}${randomNum}`;
};

const handleCompanyChange = (id: number) => {
  const company = props.companiesData.find((c) => c.id === id);
  form.expressCompany = company?.name || "";
};

// 提交发货
const submit = async () => {
  if (!form.expressCompany || !form.expressNo || !form.expressCompanyId)
    return toast("请填写完整信息", "", "error");
  loading.value = true;
  try {
    await shipOrder(
      currentOrderId.value,
      form.expressCompanyId,
      form.expressNo
    );

    dialogVisible.value = false;
    emit("shipped");
    toast("发货成功");
  } catch (err) {
    toast("发货失败，请重新尝试");
  } finally {
    loading.value = false;
  }
};

defineExpose({ open });
</script>

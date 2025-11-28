<template>
  <div class="notice-page">
    <el-container class="bg-white">
      <el-header class="flex items-center justify-between border-b-1">
        <notice-header @refresh="getTableData" @add="openAdd" />
      </el-header>

      <el-main>
        <notice-table
          :data="tableData"
          :loading="isLoading"
          @delete="handleDelete"
          @edit="handleEdit"
        />
      </el-main>

      <el-footer>
        <notice-footer
          :total="totalCount"
          :current-page="currentPage"
          @change="handlePageChange"
        />
      </el-footer>
    </el-container>

    <form-drawer
      :title="drawerTitle"
      ref="formDrawRef"
      v-model="showDrawer"
      @close="showDrawer = false"
      @submit="onSubmit"
    >
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="80px"
        :inline="false"
      >
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title" placeholder="公告标题"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input
            v-model="form.content"
            :rows="5"
            type="textarea"
            placeholder="公告内容"
          />
        </el-form-item>
      </el-form>
    </form-drawer>
  </div>
</template>

<script setup lang="ts">
import NoticeFooter from "./cpns/notice-footer.vue";
import NoticeHeader from "./cpns/notice-header.vue";
import NoticeTable from "./cpns/notice-table.vue";
import { reactive, ref } from "vue";
import type { INoticeData, INoticeItem, RuleForm } from "./type";
import {
  addNotice,
  deleteNotice,
  getNoticeList,
  updateNotice,
} from "@/services/modules/notice";
import FormDrawer from "@/components/formDrawer.vue";
import { type FormInstance, type FormRules } from "element-plus";
import { toast } from "@/assets/base-ui/toast";

const tableData = ref<INoticeItem[]>([]);
const currentPage = ref(1);
const totalCount = ref(0);
const isLoading = ref(false);

const showDrawer = ref(false);
const formDrawRef = ref();
const formRef = ref<FormInstance>();
const form = reactive({
  id: 0,
  title: "",
  content: "",
});
const drawerMode = ref<"add" | "edit" | "delete">("add");
const drawerTitle = ref("");
const rules = reactive<FormRules<RuleForm>>({
  title: [{ required: true, message: "公告不能为空", trigger: "blur" }],
  content: [{ required: true, message: "公告内容不能为空", trigger: "blur" }],
});

const getTableData = async () => {
  try {
    isLoading.value = true;
    const res: INoticeData = await getNoticeList(currentPage.value);
    tableData.value = res.list;
    totalCount.value = res.totalCount;
    isLoading.value = false;
  } finally {
    isLoading.value = false;
  }
};

getTableData();

const onSubmit = async () => {
  try {
    const valid = await formRef.value?.validate();
    if (!valid) return;
    if (drawerMode.value === "add") {
      await addNotice(form.title, form.content);
      toast("添加公告成功");
    } else if (drawerMode.value === "edit") {
      await updateNotice(form.id, form.title, form.content);
      toast("修改公告成功");
    }

    showDrawer.value = false;
    //刷新
    getTableData();
  } catch (error) {
    toast("添加公告失败", "", "error");
  } finally {
    //重置表单
    form.title = "";
    form.content = "";
    form.id = 0;
  }
};

const openAdd = () => {
  drawerTitle.value = "新增";
  showDrawer.value = true;
  drawerMode.value = "add";
};

const handleEdit = (row: any) => {
  showDrawer.value = true;
  drawerTitle.value = "修改";
  drawerMode.value = "edit";
  if (!row) return;
  form.id = row.id;
  form.title = row.title;
  form.content = row.content;

  console.log(form.content, form.title);
};

const handleDelete = async (id: number) => {
  try {
    await deleteNotice(id);

    toast("删除成功", "");

    //刷新数据
    getTableData();
  } catch (error) {
    toast("删除失败", "请重新尝试", "error");
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  getTableData();
};
</script>

<style scoped></style>

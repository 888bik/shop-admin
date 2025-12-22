import { ElMessage, ElMessageBox } from "element-plus";

export const openMessageBox = async () => {
  try {
    const { value } = await ElMessageBox.prompt("请输入图片名称", "重命名", {
      confirmButtonText: "提交",
      cancelButtonText: "取消",
    });
    return value;
  } catch {
    ElMessage({
      type: "info",
      message: "已取消输入",
    });
  }
};

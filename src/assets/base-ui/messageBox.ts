import { ElMessage, ElMessageBox } from "element-plus";

export const openMessageBox = () => {
  return ElMessageBox.prompt("请输入图片名称", "重命名", {
    confirmButtonText: "提交",
    cancelButtonText: "取消",
  })
    .then(({ value }) => {
      return value;
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消输入",
      });
    });
  return null;
};

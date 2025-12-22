import { ElMessageBox } from "element-plus";

// 弹出输入框
export function showPrompt(tip: any, value = "") {
  return ElMessageBox.prompt(tip, "", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    inputValue: value,
  });
}

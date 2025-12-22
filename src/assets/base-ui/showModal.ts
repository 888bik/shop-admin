import { ElMessageBox } from "element-plus";
import type { MessageType } from "element-plus";

export function showModal(
  content = "提示内容",
  type: MessageType = "warning",
  title = ""
) {
  return ElMessageBox.confirm(content, title, {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type,
  });
}

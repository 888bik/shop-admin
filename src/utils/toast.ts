import { ElNotification } from "element-plus";

export function toast(
  title: string,
  message?: string,
  type: "success" | "error" | "warning" | "info" = "success"
) {
  ElNotification({
    title,
    message,
    type,
    duration: 2000,
  });
}

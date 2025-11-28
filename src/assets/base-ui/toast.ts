import { ElNotification } from "element-plus";

export function toast(
  title: string,
  message?: string,
  type: "success" | "error" | "warning" | "info" = "success",
  dangerouslyUseHTMLString = false
) {
  ElNotification({
    title,
    message,
    type,
    dangerouslyUseHTMLString,
    duration: 2000,
  });
}

import NProgress from "nprogress";

//显示全屏加载栏
export function showFullLoading() {
  NProgress.start();
}
//关闭全屏加载栏
export function hideFullLoading() {
  NProgress.done();
}

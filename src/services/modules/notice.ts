import { noticeRequest } from "..";

export const getNoticeList = (page: number = 1) => {
  return noticeRequest.get(`admin/notice/${page}`);
};

export const addNotice = (title: string, content: string) => {
  return noticeRequest.post("admin/notice", { title, content });
};

export const deleteNotice = (id: number) => {
  return noticeRequest.post(`admin/notice/${id}/delete`);
};

export const updateNotice = (id: number, title: string, content: string) => {
  return noticeRequest.post(`admin/notice/${id}`, { title, content });
};

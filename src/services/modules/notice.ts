import { noticeRequest } from "..";

export function getNoticeList(page: number = 1) {
  return noticeRequest
    .request({
      url: `admin/notice/${page}`,
      method: "get",
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
}

export function addNotice(title: string, content: string) {
  return noticeRequest
    .request({
      url: "admin/notice",
      method: "post",
      data: {
        title,
        content,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
}

export function deleteNotice(id: number) {
  return noticeRequest
    .request({
      url: `admin/notice/${id}/delete`,
      method: "post",
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
}

export function updateNotice(id: number, title: string, content: string) {
  return noticeRequest
    .request({
      url: `admin/notice/${id}`,
      method: "post",
      data: {
        title,
        content,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
}

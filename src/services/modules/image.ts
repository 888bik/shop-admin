import type { AxiosError } from "axios";
import { imageRequest } from "..";

export function getImageCategory(page: number = 1, limit: number = 10) {
  return imageRequest
    .request({
      url: `admin/image_class/${page}`,
      method: "get",
      params: {
        limit,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

export function addImageCategory(name: string, order: number) {
  return imageRequest
    .request({
      url: "/admin/image_class",
      method: "post",
      data: {
        name,
        order,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

export function editImageCategory(id: number, name: string, order: number) {
  return imageRequest
    .request({
      url: `/admin/image_class/${id}`,
      method: "post",
      data: {
        name,
        order,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

export function deleteImageCategory(id: number) {
  return imageRequest
    .request({
      url: `/admin/image_class/${id}/delete`,
      method: "post",
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
}

export function getImageListById(
  categoryId: number,
  currentPage: number,
  limit: number = 10
) {
  return imageRequest
    .request({
      url: `admin/image_class/${categoryId}/image/${currentPage}`,
      method: "get",
      params: {
        limit,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
}

export function deleteImageById(ids: any[]) {
  return imageRequest
    .request({
      url: "admin/image/delete_all",
      method: "post",
      data: {
        ids,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err: AxiosError) => {
      throw err;
    });
}

export function editImageNameById(id: number, name: string) {
  return imageRequest
    .request({
      url: `admin/image/${id}`,
      method: "post",
      data: {
        name,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
}

export function uploadImageFile(categoryId: number, file: File) {
  const formData = new FormData();
  formData.append("img", file);
  formData.append("image_class_id", String(categoryId));
  return imageRequest
    .request({
      url: "/admin/image/upload",
      method: "post",
      data: formData,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
}

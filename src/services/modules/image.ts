import { imageRequest } from "..";

export interface ImageCategoryPayload {
  name: string;
  order: number;
}

export interface CreateImageCategoryPayload extends ImageCategoryPayload {}
export interface UpdateImageCategoryPayload extends ImageCategoryPayload {}

export const getImageCategoryList = (page: number = 1, limit: number = 10) => {
  return imageRequest.get(`admin/image_class/${page}`, { params: { limit } });
};

export const createImageCategory = (payload: CreateImageCategoryPayload) => {
  return imageRequest.post("admin/image_class", { ...payload });
};

export const updateImageCategory = (
  id: number,
  payload: UpdateImageCategoryPayload
) => {
  return imageRequest.post(`admin/image_class/${id}`, { ...payload });
};

export const deleteImageCategory = (id: number) => {
  return imageRequest.post(`admin/image_class/${id}/delete`);
};

export const getImageList = (
  categoryId: number,
  currentPage: number,
  limit: number = 10
) => {
  return imageRequest.get(
    `admin/image_class/${categoryId}/image/${currentPage}`,
    { params: { limit } }
  );
};

export const deleteImage = (ids: any[]) => {
  return imageRequest.post("admin/image/delete_all", { ids });
};

// 数据格式：普通对象 → Axios 会自动 JSON.stringify()
// Content-Type：默认 application/json;charset=UTF-8
// 适用场景：提交结构化数据
export const updateImageName = (id: number, name: string) => {
  return imageRequest.post(`admin/image/${id}`, { name });
};

// 数据格式：FormData 对象 → 可以附带文件和普通字段
// Content-Type：multipart/form-data（Axios 会自动设置 boundary）
// 适用场景：上传图片、视频、文件，或者表单中混合文件和文本字段
export const uploadImageFile = (categoryId: number, file: File) => {
  const formData = new FormData();
  formData.append("img", file);
  formData.append("image_class_id", String(categoryId));
  return imageRequest.post("admin/image/upload", formData);
};

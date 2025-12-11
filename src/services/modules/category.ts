import { categoryRequest } from "..";

export interface ICategoryListItem {
  id: number;
  categoryId: number;
  name: string;
  order: number;
  status: number;
  child: [];
  crateTime: string;
  updateTime: string;
}

export interface CategoryListResponse {
  list: ICategoryListItem[];
  totalCount: number;
}
export interface CategoryPayload {
  name: string;
  order: number;
  status: number;
}

export interface createCategoryPayload extends CategoryPayload {}
export interface updateCategoryPayload extends CategoryPayload {}

export const getCategoryList = (
  page: number = 1,
  limit: number = 10,
  typeCode?: string
) => {
  return categoryRequest.get<CategoryListResponse>(`admin/category/${page}`, {
    params: { limit, type: typeCode },
  });
};

export const createCategory = (payload: createCategoryPayload) => {
  return categoryRequest.post("admin/category", { ...payload });
};

export const deleteCategory = (id: number | number[]) => {
  return categoryRequest.post(`admin/category/${id}/delete`);
};

export const updateCategory = (id: number, payload: updateCategoryPayload) => {
  return categoryRequest.post(`admin/category/${id}`, { ...payload });
};

export const updateCategoryStatus = (id: number, status: number) => {
  return categoryRequest.post(`admin/category/${id}/update_status`, { status });
};

export const getCategoryTypeList = () => {
  return categoryRequest.get("admin/category_type/list/vo");
};

export const getCategoryListByType = (typeCode: string) => {
  return categoryRequest.get("admin/category/1", {
    params: { type: typeCode },
  });
};

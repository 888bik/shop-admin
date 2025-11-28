export interface ICategoryItem {
  id: number;
  name: string;
  order: number;
  image_count: number;
}

export interface IImageCategory {
  list: ICategoryItem[];
  totalCount: number;
}

export interface IImageItem {
  id: number;
  url: string;
  name: string;
  path: string;
  imageClassId: number;
  createTime: string;
  updateTime: string;
}

export interface IImageList {
  list: IImageItem[];
  totalCount: number;
}

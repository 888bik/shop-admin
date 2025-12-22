import { composeRefs } from "element-plus/es/utils/index.mjs";
import { commentsRequest } from "..";

export interface ICommentItem {
  id: number;
  orderId: number;
  goodsId: number;
  goodsTitle: string;
  goodsCover: string;
  userId: number;
  nickname: string;
  avatar: string;
  review: string;
  rating: number;
  reviewImages: string | string[];
  reviewAppend: any;
  reviewTime: string;
  reviewStatus: number;
  reviewAppendTime: string;
  replyContent: string;
  replyTime: string;
  anonymous: number;
  status: number;
}

export interface CommentsListResponse {
  size: number;
  page: number;
  list: ICommentItem[];
  totalCount: number;
}

export const getCommentsList = (
  page: number,
  limit: number,
  keyword: string
) => {
  return commentsRequest.get<CommentsListResponse>("admin/comments/list", {
    params: { page, limit, keyword },
  });
};

export const reviewGoodsComment = (id: number, content: string) => {
  return commentsRequest.post("admin/comments/reply", {
    commentId: id,
    replyContent: content,
  });
};

export const updateCommentStatus = (id: number, status: number) => {
  return commentsRequest.post("admin/comments/status", {
    commentId: id,
    status,
  });
};

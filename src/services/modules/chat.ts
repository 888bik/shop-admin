import { chatRequest } from "..";

export interface SessionsItem {
  id: number;
  userId: number;
  serviceId: number;
  status: number;
  createTime: number;
  updateTime: number;
  nickname: string;
  avatar: string;
  lastMessage: string;
  unread: number;
  online: boolean;
}

export interface MessageItem {
  id: number;
  sessionId: number;
  senderId: number;
  senderRole: number;
  content: string;
  createTime: number;
  nickname: string;
  avatar: string;
  contentType: "text" | "image";
}

export const getSessions = (serviceId: number) => {
  return chatRequest.get<SessionsItem[]>(`admin/chat/sessions`, {
    params: { serviceId },
  });
};

export const getMessages = (sessionId: number) => {
  return chatRequest.get<MessageItem[]>(
    `admin/chat/sessions/${sessionId}/messages`
  );
};

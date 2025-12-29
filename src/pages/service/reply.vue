<template>
  <el-container class="chat-page">
    <!-- 左侧会话列表 -->
    <el-aside width="250px" class="chat-aside">
      <el-input
        v-model="search"
        placeholder="搜索用户或会话"
        prefix-icon="el-icon-search"
        size="small"
        clearable
        class="search-input"
      />
      <el-scrollbar class="chat-list">
        <div
          v-for="session in filteredSessions"
          :key="session.id"
          class="chat-session-card"
          :class="{ active: currentSession?.id === session.id }"
          @click="selectSession(session)"
        >
          <el-avatar :src="session.avatar" :size="40" />
          <div class="session-info">
            <div class="nickname">{{ session.name }}</div>
            <div class="last-message">{{ session.lastMessage }}</div>
          </div>
          <el-badge
            v-if="session.unread > 0"
            :value="session.unread"
            class="unread-badge"
          />
        </div>
      </el-scrollbar>
    </el-aside>

    <!-- 右侧聊天区 -->
    <el-main class="chat-main">
      <div v-if="currentSession" class="chat-header">
        <el-avatar :src="currentSession.avatar" :size="40" />
        <div class="user-info">
          <div class="nickname">{{ currentSession.name }}</div>
          <div class="status" :class="{ online: currentSession.online }">
            <span class="status-dot"></span>
            {{ currentSession.online ? "在线" : "离线" }}
          </div>
        </div>
      </div>

      <el-scrollbar ref="messagesWrap" class="chat-messages">
        <div
          v-for="(msg, index) in currentSession?.messages || []"
          :key="index"
          :class="['chat-message', msg.senderRole === 2 ? 'right' : 'left']"
        >
          <el-avatar :src="msg.avatar" :size="35" />
          <div
            class="message-content"
            :class="msg.senderRole === 2 ? 'customer-msg' : 'user-msg'"
          >
            <div v-if="msg.contentType === 'text'" class="text">
              {{ msg.content }}
            </div>
            <img
              v-if="msg.contentType === 'image'"
              :src="msg.content"
              class="image-msg"
            />
            <div class="time">{{ formatTime(msg.createTime) }}</div>
          </div>
        </div>
      </el-scrollbar>

      <!-- 底部输入框 -->
      <div class="chat-input">
        <el-input
          v-model="newMessage"
          placeholder="输入消息"
          class="input-text"
          @keyup.enter="sendMessage"
          clearable
        />
        <el-button type="primary" @click="sendMessage">发送</el-button>
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { ElMessage } from "element-plus";
import { getToken } from "@/utils/auth";
import { getSessions, getMessages } from "@/services/modules/chat";
import useUserStore from "@/store/modules/manager";
import { ElScrollbar } from "element-plus";

interface Message {
  senderId: number;
  senderRole: number; // 1=用户, 2=客服
  contentType: "text" | "image";
  content: string;
  createTime: number; // 秒级时间戳
  nickname: string;
  avatar: string;
}

interface Session {
  id: number;
  userId: number;
  name: string;
  avatar: string;
  lastMessage: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

const search = ref("");
const newMessage = ref("");
const sessions = reactive<Session[]>([]);
const currentSession = ref<Session | null>();
const socket = ref<WebSocket | null>(null);

const messagesWrap = ref<InstanceType<typeof ElScrollbar> | null>(null);
const wrap = ref<HTMLElement | null>(null);
const userInfo = useUserStore();
const accessToken = getToken("accessToken");

// 当前客服信息
const currentUser = reactive({
  id: userInfo.user?.id,
  name: userInfo.user?.username || "客服",
  avatar: userInfo.user?.avatar,
});

const filteredSessions = computed(() =>
  search.value
    ? sessions.filter((s) => s.name.includes(search.value))
    : sessions
);

function formatTime(timestamp: number) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// 选择会话
async function selectSession(session: Session) {
  currentSession.value = session;
  session.unread = 0;

  // 拉取消息
  try {
    const res = await getMessages(session.id);
    session.messages = res.map((m) => ({
      senderId: m.senderId,
      senderRole: m.senderRole,
      contentType: m.contentType || "text",
      content: m.content,
      createTime: m.createTime,
      nickname: m.nickname,
      avatar: m.avatar,
    }));

    if (session.messages.length)
      session.lastMessage =
        session.messages[session.messages.length - 1].content;

    nextTick(scrollToBottom);
  } catch (err) {
    console.error("获取消息失败", err);
  }
}

// 发送消息
function sendMessage() {
  if (!currentSession.value) {
    ElMessage.warning("请选择会话");
    return;
  }
  if (!newMessage.value?.trim()) return;

  const content = newMessage.value.trim();
  const msg: Message = {
    senderId: currentUser.id,
    senderRole: 2,
    contentType: "text",
    content,
    createTime: Math.floor(Date.now() / 1000),
    nickname: currentUser.name,
    avatar: currentUser.avatar,
  };

  currentSession.value.messages.push(msg);
  currentSession.value.lastMessage = content;
  newMessage.value = "";
  nextTick(scrollToBottom);

  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    socket.value.send(
      JSON.stringify({
        type: "chat",
        content,
        sessionId: currentSession.value.id,
      })
    );
  } else {
    ElMessage.info("消息已加入本地（WS 未连接）");
  }
}

// 滚动到底部
function scrollToBottom() {
  nextTick(() => {
    if (!messagesWrap.value) return;

    const scrollbar = messagesWrap.value;
    scrollbar.setScrollTop(scrollbar.wrapRef?.scrollHeight || 0);
  });
}

// WebSocket 连接
function connectWS(token: string) {
  if (socket.value && socket.value.readyState === WebSocket.OPEN) return;

  socket.value = new WebSocket(
    `ws://localhost:11048/ws/chat?accessToken=${token}`
  );

  socket.value.onopen = () => console.log("WebSocket 已连接");

  socket.value.onmessage = (ev) => {
    const data = JSON.parse(ev.data);
    if (!data.sessionId) return;
    const session = sessions.find((s) => s.id === data.sessionId);
    if (!session) return;

    const msg: Message = {
      senderId: data.senderId,
      senderRole: data.senderRole,
      contentType: data.contentType || "text",
      content: data.content,
      createTime: data.createTime,
      nickname: data.senderRole === 1 ? session.name : currentUser.name,
      avatar: data.senderRole === 1 ? session.avatar : currentUser.avatar,
    };
    session.messages.push(msg);
    session.lastMessage = msg.content;

    if (currentSession.value?.id !== session.id) {
      session.unread = (session.unread || 0) + 1;
    } else {
      nextTick(scrollToBottom);
    }
  };

  socket.value.onclose = () => {
    console.log("WebSocket 已关闭");
    socket.value = null;
  };
  socket.value.onerror = (err) => console.error("WebSocket 错误", err);
}

onMounted(async () => {
  try {
    // 获取会话列表
    const res = await getSessions(userInfo.user?.id);
    const list: Session[] = res.map((s) => ({
      id: s.id,
      userId: s.userId,
      name: s.nickname || "用户",
      avatar: s.avatar || "https://i.pravatar.cc/40",
      lastMessage: "",
      unread: 0,
      online: true,
      messages: [],
    }));
    sessions.splice(0, sessions.length, ...list);

    // 默认选中第一个会话
    if (sessions.length) selectSession(sessions[0]);
  } catch (err) {
    console.error("获取会话列表失败", err);
  }

  // 建立 WebSocket
  connectWS(accessToken!);
});

onBeforeUnmount(() => {
  if (socket.value) socket.value.close();
});
</script>

<style scoped>
.chat-page {
  height: 100vh;
  display: flex;
  background: #f5f7fa;
}
.chat-aside {
  border-right: 1px solid #e0e6ed;
  display: flex;
  height: 100vh; /* 占满屏幕高度 */
  flex-direction: column;
  background: #fff;
}
.search-input {
  margin: 10px;
  width: 90%;
}
.chat-list {
  flex: 1;
  overflow-y: auto; /* 可滚动 */
  padding-bottom: 10px; /* 防止最后一条被遮挡 */
}
.chat-session-card {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 6px;
  margin: 5px 10px;
  transition: background 0.2s;
}
.chat-session-card:hover {
  background: #f0f4f8;
}
.chat-session-card.active {
  background: #e6f7ff;
}
.session-info {
  margin-left: 10px;
  flex: 1;
  overflow: hidden;
}
.nickname {
  font-weight: 600;
  font-size: 14px;
}
.last-message {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.unread-badge {
  margin-left: 5px;
}
.chat-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  background: #f9fafc;
}
.chat-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #e0e6ed;
}
.user-info {
  margin-left: 12px;
}
.status {
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
  margin-top: 2px;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
  background-color: green;
}
.status.online .status-dot {
  background-color: green;
}
.status:not(.online) .status-dot {
  background-color: #ccc;
}
.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}
.chat-message {
  display: flex;
  margin-bottom: 12px;
  align-items: flex-end;
}
.chat-message.left {
  flex-direction: row;
}
.chat-message.right {
  flex-direction: row-reverse;
}
.message-content {
  max-width: 65%;
  margin: 0 10px;
  padding: 10px 14px;
  border-radius: 12px;
  word-break: break-word;
  position: relative;
}
.customer-msg {
  background-color: #409eff;
  color: #fff;
}
.user-msg {
  background-color: #f0f0f0;
  color: #333;
}
.message-content .image-msg {
  max-width: 100%;
  border-radius: 10px;
}
.message-content .time {
  font-size: 10px;
  color: #c0c4cc;
  margin-top: 4px;
  text-align: right;
}
.chat-input {
  display: flex;
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #e0e6ed;
  align-items: center;
}
.input-text {
  flex: 1;
  margin-right: 8px;
}
.upload-btn {
  margin-right: 8px;
}
</style>

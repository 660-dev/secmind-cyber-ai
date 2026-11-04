<template>
  <div class="chat-container" :class="`theme-${aiType}`">
    <!-- 聊天记录区域 -->
    <div class="chat-messages" ref="messagesContainer">
      <div v-for="(msg, index) in messages" :key="index" class="message-wrapper">
        <!-- AI消息 -->
        <div v-if="!msg.isUser"
             class="message ai-message"
             :class="[msg.type]">
          <div class="avatar ai-avatar">
            <AiAvatarFallback :type="aiType" />
          </div>
          <div class="message-bubble">
            <div class="message-content">
              {{ msg.content }}
              <span v-if="connectionStatus === 'connecting' && index === messages.length - 1" class="typing-indicator">▋</span>
            </div>
            <div class="message-time">{{ formatTime(msg.time) }}</div>
          </div>
        </div>

        <!-- 用户消息 -->
        <div v-else class="message user-message" :class="[msg.type]">
          <div class="message-bubble">
            <div class="message-content">{{ msg.content }}</div>
            <div class="message-time">{{ formatTime(msg.time) }}</div>
          </div>
          <div class="avatar user-avatar">
            <div class="avatar-placeholder">我</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input-container">
      <div class="chat-input">
        <textarea
          v-model="inputMessage"
          @keydown.enter.prevent="sendMessage"
          placeholder="请输入消息..."
          class="input-box"
          :disabled="connectionStatus === 'connecting'"
        ></textarea>
        <button
          @click="sendMessage"
          class="send-button"
          :disabled="connectionStatus === 'connecting' || !inputMessage.trim()"
        >
          <svg v-if="connectionStatus !== 'connecting'" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
          <span v-else class="sending-dots"><i></i><i></i><i></i></span>
          <span class="send-text">发送</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import AiAvatarFallback from './AiAvatarFallback.vue'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  connectionStatus: {
    type: String,
    default: 'disconnected'
  },
  aiType: {
    type: String,
    default: 'default'  // 'love' 或 'super'
  }
})

const emit = defineEmits(['send-message'])

const inputMessage = ref('')
const messagesContainer = ref(null)

// 发送消息
const sendMessage = () => {
  if (!inputMessage.value.trim()) return

  emit('send-message', inputMessage.value)
  inputMessage.value = ''
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

// 自动滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 监听消息变化与内容变化，自动滚动
watch(() => props.messages.length, () => {
  scrollToBottom()
})

watch(() => props.messages.map(m => m.content).join(''), () => {
  scrollToBottom()
})

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
/* ===== 主题变量：按 AI 类型切换强调色 ===== */
.chat-container {
  --accent: var(--cyan);
  --accent-soft: var(--cyan-soft);
  --accent-faint: var(--cyan-faint);
  --accent-grad-a: #00b2ff;
  --accent-grad-b: #00e5ff;
}

.theme-love {
  --accent: var(--cyan);
  --accent-soft: var(--cyan-soft);
  --accent-faint: var(--cyan-faint);
  --accent-grad-a: #00b2ff;
  --accent-grad-b: #00e5ff;
}

.theme-super {
  --accent: var(--purple);
  --accent-soft: var(--purple-soft);
  --accent-faint: var(--purple-faint);
  --accent-grad-a: #4f8bff;
  --accent-grad-b: #8b5cf6;
}

/* ===== 容器 ===== */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 560px;
  background: var(--bg-panel);
  border: 1px solid var(--line-dim);
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
  box-shadow: 0 16px 48px rgba(2, 6, 16, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

/* 顶部霓虹高光线 */
.chat-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  opacity: 0.8;
  z-index: 2;
  pointer-events: none;
}

/* ===== 消息区 ===== */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 84px;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 74px;
  background:
    radial-gradient(600px 300px at 50% 0%, rgba(0, 229, 255, 0.05), transparent 70%),
    transparent;
}

.message-wrapper {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.message {
  display: flex;
  align-items: flex-start;
  max-width: 82%;
  margin-bottom: 6px;
}

.user-message {
  margin-left: auto;
  flex-direction: row;
}

.ai-message {
  margin-right: auto;
}

/* ===== 头像 ===== */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar {
  margin-left: 10px;
}

.ai-avatar {
  margin-right: 10px;
  position: relative;
}

/* AI 头像外发光环 */
.ai-avatar::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 1px solid var(--accent-faint);
  pointer-events: none;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.05));
  border: 1px solid var(--line-dim);
  color: var(--text-mid);
  font-weight: 600;
  font-size: 0.95rem;
  backdrop-filter: blur(4px);
}

/* ===== 气泡 ===== */
.message-bubble {
  padding: 12px 16px;
  border-radius: 16px;
  position: relative;
  word-wrap: break-word;
  min-width: 90px;
  backdrop-filter: blur(6px);
}

.user-message .message-bubble {
  background: linear-gradient(135deg, var(--accent-grad-a), var(--accent-grad-b));
  color: #fff;
  border-bottom-right-radius: 5px;
  text-align: left;
  box-shadow: 0 6px 20px var(--accent-faint);
}

.ai-message .message-bubble {
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid var(--line-dim);
  color: var(--text-hi);
  border-bottom-left-radius: 5px;
  text-align: left;
  transition: border-color 0.3s;
}

.ai-message:hover .message-bubble {
  border-color: var(--accent-faint);
}

/* AI 气泡左侧霓虹指示线 */
.ai-message .message-bubble::before {
  content: '';
  position: absolute;
  left: 0;
  top: 16px;
  bottom: 16px;
  width: 2px;
  border-radius: 2px;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
  opacity: 0.7;
}

.message-content {
  font-size: 15px;
  line-height: 1.65;
  white-space: pre-wrap;
}

.message-time {
  font-size: 11px;
  color: var(--text-low);
  margin-top: 6px;
  text-align: right;
  font-family: var(--font-mono);
}

/* ===== 输入区 ===== */
.chat-input-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-input);
  border-top: 1px solid var(--line-dim);
  z-index: 100;
  height: 74px;
  backdrop-filter: blur(10px);
}

.chat-input {
  display: flex;
  padding: 14px 16px;
  height: 100%;
  box-sizing: border-box;
  align-items: center;
}

.input-box {
  flex-grow: 1;
  border: 1px solid var(--line-dim);
  border-radius: 12px;
  padding: 10px 16px;
  font-size: 15px;
  font-family: inherit;
  color: var(--text-hi);
  resize: none;
  min-height: 22px;
  max-height: 44px;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  background: rgba(255, 255, 255, 0.03);
}

.input-box::-webkit-scrollbar {
  display: none;
}

.input-box::placeholder {
  color: var(--text-low);
}

.input-box:focus {
  border-color: var(--accent-soft);
  box-shadow: 0 0 0 3px var(--accent-faint);
}

.send-button {
  margin-left: 12px;
  background: linear-gradient(135deg, var(--accent-grad-a), var(--accent-grad-b));
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0 20px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  transition: box-shadow 0.3s, transform 0.2s;
  height: 44px;
  align-self: center;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  box-shadow: 0 4px 18px var(--accent-faint);
}

.send-button:hover:not(:disabled) {
  box-shadow: 0 0 22px var(--accent-soft);
  transform: translateY(-1px);
}

/* 发送中动画点 */
.sending-dots {
  display: inline-flex;
  gap: 4px;
}

.sending-dots i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #fff;
  animation: dot-bounce 1s ease-in-out infinite;
}

.sending-dots i:nth-child(2) {
  animation-delay: 0.16s;
}

.sending-dots i:nth-child(3) {
  animation-delay: 0.32s;
}

/* ===== 打字指示器 ===== */
.typing-indicator {
  display: inline-block;
  animation: blink 0.7s infinite;
  margin-left: 2px;
  color: var(--accent);
  font-weight: 700;
}

/* ===== 动画 ===== */
@keyframes blink {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes dot-bounce {
  0%, 100% { transform: translateY(0); opacity: 0.5; }
  50% { transform: translateY(-4px); opacity: 1; }
}

/* ===== 消息类型 ===== */
.ai-answer {
  animation: fadeIn 0.3s ease-in-out;
}

.ai-error {
  opacity: 0.7;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 连续 AI 气泡收拢 */
.ai-message + .ai-message {
  margin-top: 6px;
}

.ai-message + .ai-message .avatar {
  visibility: hidden;
}

.ai-message + .ai-message .message-bubble {
  border-top-left-radius: 10px;
}

/* 禁用态 */
.input-box:disabled,
.send-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .chat-container {
    min-height: 520px;
  }

  .message {
    max-width: 92%;
  }

  .message-content {
    font-size: 14.5px;
  }

  .chat-input {
    padding: 12px;
  }

  .input-box {
    padding: 9px 13px;
  }

  .send-button {
    padding: 0 16px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .avatar {
    width: 34px;
    height: 34px;
  }

  .message-bubble {
    padding: 10px 13px;
  }

  .message-content {
    font-size: 14px;
  }

  .chat-input-container {
    height: 66px;
  }

  .chat-messages {
    bottom: 66px;
    padding-bottom: 70px;
  }

  .chat-container {
    min-height: 460px;
  }
}
</style>

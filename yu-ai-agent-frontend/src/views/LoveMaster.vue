<template>
  <div class="love-master-container">
    <div class="header">
      <div class="back-button" @click="goBack">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        返回
      </div>
      <div class="title-wrap">
        <h1 class="title">AI网络安全助手</h1>
        <span class="title-underline"></span>
      </div>
      <div class="chat-id">
        <span class="id-dot"></span>
        <span class="id-text">会话ID: {{ chatId }}</span>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="chat-area">
        <ChatRoom
          :messages="messages"
          :connection-status="connectionStatus"
          ai-type="love"
          @send-message="sendMessage"
        />
      </div>
    </div>

    <div class="footer-container">
      <AppFooter />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import ChatRoom from '../components/ChatRoom.vue'
import AppFooter from '../components/AppFooter.vue'
import { chatWithLoveApp } from '../api'

// 设置页面标题和元数据
useHead({
  title: 'AI网络安全助手 - Intelligence Designed To Evolve',
  meta: [
    {
      name: 'description',
      content: 'AI网络安全助手是资深安全工程师智能体，提供安全学习、漏洞分析、应急响应和防护加固建议'
    },
    {
      name: 'keywords',
      content: 'AI网络安全助手,网络安全,漏洞分析,应急响应,安全加固,AI智能体'
    }
  ]
})

const router = useRouter()
const messages = ref([])
const chatId = ref('')
const connectionStatus = ref('disconnected')
let eventSource = null

// 生成随机会话ID
const generateChatId = () => {
  return 'love_' + Math.random().toString(36).substring(2, 10)
}

// 添加消息到列表
const addMessage = (content, isUser) => {
  messages.value.push({
    content,
    isUser,
    time: new Date().getTime()
  })
}

// 发送消息
const sendMessage = (message) => {
  addMessage(message, true)

  // 连接SSE
  if (eventSource) {
    eventSource.close()
  }

  // 创建一个空的AI回复消息
  const aiMessageIndex = messages.value.length
  addMessage('', false)

  connectionStatus.value = 'connecting'
  eventSource = chatWithLoveApp(message, chatId.value)

  // 监听SSE消息
  eventSource.onmessage = (event) => {
    const data = event.data
    if (data && data !== '[DONE]') {
      // 更新最新的AI消息内容，而不是创建新消息
      if (aiMessageIndex < messages.value.length) {
        messages.value[aiMessageIndex].content += data
      }
    }

    if (data === '[DONE]') {
      connectionStatus.value = 'disconnected'
      eventSource.close()
    }
  }

  // 监听SSE错误
  eventSource.onerror = (error) => {
    console.error('SSE Error:', error)
    connectionStatus.value = 'error'
    eventSource.close()
  }
}

// 返回主页
const goBack = () => {
  router.push('/')
}

// 页面加载时添加欢迎消息
onMounted(() => {
  // 生成聊天ID
  chatId.value = generateChatId()

  // 添加欢迎消息
  addMessage('欢迎来到AI网络安全助手，你可以咨询安全学习、漏洞分析、应急响应等问题，我会给出分析步骤和处置建议。', false)
})

// 组件销毁前关闭SSE连接
onBeforeUnmount(() => {
  if (eventSource) {
    eventSource.close()
  }
})
</script>

<style scoped>
.love-master-container {
  --accent: var(--cyan);
  --accent-soft: var(--cyan-soft);
  --accent-faint: var(--cyan-faint);

  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

/* ===== HUD 头部 ===== */
.header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 16px 26px;
  background: linear-gradient(180deg, rgba(10, 15, 30, 0.85), rgba(7, 11, 22, 0.4));
  border-bottom: 1px solid var(--line-dim);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-button {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 15px;
  color: var(--text-mid);
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid transparent;
  transition: all 0.25s;
}

.back-button:hover {
  color: var(--text-hi);
  border-color: var(--accent-faint);
  background: var(--accent-faint);
}

.title-wrap {
  justify-self: center;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.title {
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 700;
  letter-spacing: 3px;
  margin: 0;
  color: var(--text-hi);
  text-shadow: 0 0 16px var(--accent-soft);
}

.title-underline {
  width: 52px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  box-shadow: 0 0 10px var(--accent-soft);
}

.chat-id {
  justify-self: end;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  letter-spacing: 1px;
  color: var(--text-mid);
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--line-dim);
  background: rgba(255, 255, 255, 0.03);
}

.id-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
  animation: dot-pulse 2s ease-in-out infinite;
}

/* ===== 内容区 ===== */
.content-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.chat-area {
  flex: 1;
  padding: 20px 18px;
  overflow: hidden;
  position: relative;
  min-height: calc(100vh - 64px - 210px);
  margin-bottom: 18px;
  max-width: 920px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.footer-container {
  margin-top: auto;
}

/* ===== 动画 ===== */
@keyframes dot-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.35; transform: scale(0.7); }
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .header {
    padding: 12px 16px;
  }

  .title {
    font-size: 18px;
    letter-spacing: 2px;
  }

  .chat-id {
    font-size: 11px;
    padding: 5px 10px;
  }

  .chat-area {
    padding: 14px 12px;
    min-height: calc(100vh - 56px - 190px);
  }
}

@media (max-width: 480px) {
  .header {
    padding: 10px 12px;
  }

  .back-button {
    font-size: 14px;
    padding: 6px 10px;
  }

  .title {
    font-size: 16px;
  }

  .id-text {
    display: none;
  }

  .chat-area {
    padding: 10px 8px;
    min-height: calc(100vh - 50px - 180px);
  }
}
</style>

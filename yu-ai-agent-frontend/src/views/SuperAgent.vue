<template>
  <div class="super-agent-container">
    <div class="header">
      <div class="back-button" @click="goBack">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        返回
      </div>
      <div class="title-wrap">
        <h1 class="title">AI全能助手</h1>
        <span class="title-underline"></span>
      </div>
      <div class="status-badge">
        <span class="status-dot"></span>
        <span class="status-text">SYSTEM ONLINE</span>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="chat-area">
        <ChatRoom
          :messages="messages"
          :connection-status="connectionStatus"
          ai-type="super"
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
import { chatWithManus } from '../api'

// 设置页面标题和元数据
useHead({
  title: 'AI全能助手 - Intelligence Designed To Evolve',
  meta: [
    {
      name: 'description',
      content: 'AI全能助手是全能型智能助手，能解答各类专业问题，提供精准建议和解决方案'
    },
    {
      name: 'keywords',
      content: 'AI全能助手,智能助手,专业问答,AI问答,专业建议,AI智能体'
    }
  ]
})

const router = useRouter()
const messages = ref([])
const connectionStatus = ref('disconnected')
let eventSource = null

// 添加消息到列表
const addMessage = (content, isUser, type = '') => {
  messages.value.push({
    content,
    isUser,
    type,
    time: new Date().getTime()
  })
}

// 发送消息
const sendMessage = (message) => {
  addMessage(message, true, 'user-question')

  // 连接SSE
  if (eventSource) {
    eventSource.close()
  }

  // 设置连接状态
  connectionStatus.value = 'connecting'

  // 临时存储
  let messageBuffer = []; // 用于存储SSE消息的缓冲区
  let lastBubbleTime = Date.now(); // 上一个气泡的创建时间
  let isFirstResponse = true; // 是否是第一次响应

  const chineseEndPunctuation = ['。', '！', '？', '…']; // 中文句子结束标点
  const minBubbleInterval = 800; // 气泡最小间隔时间(毫秒)

  // 创建消息气泡的函数
  const createBubble = (content, type = 'ai-answer') => {
    if (!content.trim()) return;

    // 添加适当的延迟，使消息显示更自然
    const now = Date.now();
    const timeSinceLastBubble = now - lastBubbleTime;

    if (isFirstResponse) {
      // 第一条消息立即显示
      addMessage(content, false, type);
      isFirstResponse = false;
    } else if (timeSinceLastBubble < minBubbleInterval) {
      // 如果与上一气泡间隔太短，添加一个延迟
      setTimeout(() => {
        addMessage(content, false, type);
      }, minBubbleInterval - timeSinceLastBubble);
    } else {
      // 正常添加消息
      addMessage(content, false, type);
    }

    lastBubbleTime = now;
    messageBuffer = []; // 清空缓冲区
  };

  eventSource = chatWithManus(message)

  // 监听SSE消息
  eventSource.onmessage = (event) => {
    const data = event.data

    if (data && data !== '[DONE]') {
      messageBuffer.push(data);

      // 检查是否应该创建新气泡
      const combinedText = messageBuffer.join('');

      // 句子结束或消息长度达到阈值
      const lastChar = data.charAt(data.length - 1);
      const hasCompleteSentence = chineseEndPunctuation.includes(lastChar) || data.includes('\n\n');
      const isLongEnough = combinedText.length > 40;

      if (hasCompleteSentence || isLongEnough) {
        createBubble(combinedText);
      }
    }

    if (data === '[DONE]') {
      // 如果还有未显示的内容，创建最后一个气泡
      if (messageBuffer.length > 0) {
        const remainingContent = messageBuffer.join('');
        createBubble(remainingContent, 'ai-final');
      }

      // 完成后关闭连接
      connectionStatus.value = 'disconnected'
      eventSource.close()
    }
  }

  // 监听SSE错误
  eventSource.onerror = (error) => {
    console.error('SSE Error:', error)
    connectionStatus.value = 'error'
    eventSource.close()

    // 如果出错时有未显示的内容，也创建气泡
    if (messageBuffer.length > 0) {
      const remainingContent = messageBuffer.join('');
      createBubble(remainingContent, 'ai-error');
    }
  }
}

// 返回主页
const goBack = () => {
  router.push('/')
}

// 页面加载时添加欢迎消息
onMounted(() => {
  // 添加欢迎消息
  addMessage('你好，我是AI全能助手。我可以解答各类问题，提供专业建议，请问有什么可以帮助你的吗？', false)
})

// 组件销毁前关闭SSE连接
onBeforeUnmount(() => {
  if (eventSource) {
    eventSource.close()
  }
})
</script>

<style scoped>
.super-agent-container {
  --accent: var(--purple);
  --accent-soft: var(--purple-soft);
  --accent-faint: var(--purple-faint);

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

.status-badge {
  justify-self: end;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--text-mid);
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--line-dim);
  background: rgba(255, 255, 255, 0.03);
}

.status-dot {
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

  .status-badge {
    font-size: 10.5px;
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

  .status-text {
    display: none;
  }

  .chat-area {
    padding: 10px 8px;
    min-height: calc(100vh - 50px - 180px);
  }
}
</style>

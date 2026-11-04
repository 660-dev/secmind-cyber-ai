# 灵盾 SecMind 前端

基于 Vue 3 + Vite 开发的 AI 网络安全助手前端，包含两个核心应用：AI 网络安全助手与 AI 全能助手。

## 功能特点

- **AI 网络安全助手**：以资深安全工程师身份，提供安全学习、漏洞分析、应急响应与防护加固建议
- **AI 全能助手**：基于 ReAct 的自主规划智能体，解决各类专业问题
- 类 ChatGPT 对话界面，SSE 流式打字机效果，支持多轮对话
- 深色科技风、响应式布局

## 技术栈

- Vue 3（`<script setup>`）+ Vite
- Vue Router
- Axios
- SSE（Server-Sent Events）
- @vueuse/head

## 开发说明

### 环境要求

- Node.js >= 16
- npm >= 7

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

默认运行在 `http://localhost:3000`。

### 构建项目

```bash
npm run build
```

## 后端接口

- `/api/ai/love_app/chat/sse` — 网络安全助手 SSE 对话接口
- `/api/ai/manus/chat` — 全能助手对话接口

后端服务默认运行在 `http://localhost:8123`，开发环境通过 Axios 指向该地址，生产环境使用相对路径 `/api`。

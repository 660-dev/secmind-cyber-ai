import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: 'Intelligence Designed To Evolve',
      description: 'Intelligence Designed To Evolve — AI网络安全助手与AI全能助手入口'
    }
  },
  {
    path: '/love-master',
    name: 'LoveMaster',
    component: () => import('../views/LoveMaster.vue'),
    meta: {
      title: 'AI网络安全助手 - Intelligence Designed To Evolve',
      description: 'AI网络安全助手是资深安全工程师智能体，提供安全学习、漏洞分析、应急响应和防护加固建议'
    }
  },
  {
    path: '/super-agent',
    name: 'SuperAgent',
    component: () => import('../views/SuperAgent.vue'),
    meta: {
      title: 'AI全能助手 - Intelligence Designed To Evolve',
      description: 'AI全能助手是全能型智能助手，能解答各类专业问题，提供精准建议和解决方案'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局导航守卫，设置文档标题
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router 
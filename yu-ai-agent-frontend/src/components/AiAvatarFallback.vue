<template>
  <div class="ai-avatar-fallback" :class="type">
    <!-- 网络安全助手：盾牌 + 对勾 -->
    <svg v-if="type === 'love'" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
    <!-- 超级智能体：AI 芯片 -->
    <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <rect x="7" y="7" width="10" height="10" rx="2"/>
      <path d="M10 12l1.5 1.5L14 11"/>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l1.8 1.8M17.2 17.2L19 19M19 5l-1.8 1.8M6.8 17.2L5 19"/>
    </svg>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'default'
  }
})
</script>

<style scoped>
.ai-avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fff;
  position: relative;
}

.love {
  background: linear-gradient(135deg, #00b2ff, #00e5ff);
  box-shadow: 0 2px 14px rgba(0, 180, 220, 0.5);
}

.default,
.super {
  background: linear-gradient(135deg, #4f8bff, #8b5cf6);
  box-shadow: 0 2px 14px rgba(79, 139, 255, 0.5);
}
</style>

<template>
  <div class="landing">
    <!-- 全屏视频背景 -->
    <video class="bg-video" autoplay muted loop playsinline>
      <source
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4"
        type="video/mp4"
      />
    </video>

    <!-- 可读性暗角 -->
    <div class="veil"></div>

    <!-- 内容：标题 + 两个入口 -->
    <div class="landing-inner">
      <h1 class="headline">
        <span class="line line-1">Intelligence</span>
        <span class="line line-2">Designed To Evolve</span>
      </h1>

      <div class="entries">
        <router-link class="entry entry-sec" to="/love-master">
          <span class="entry-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </span>
          AI网络安全助手
        </router-link>

        <router-link class="entry entry-super" to="/super-agent">
          <span class="entry-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="7" y="7" width="10" height="10" rx="2"/>
              <path d="M10 12l1.5 1.5L14 11"/>
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
            </svg>
          </span>
          AI全能助手
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useHead } from '@vueuse/head'

useHead({
  title: 'Intelligence Designed To Evolve'
})
</script>

<style scoped>
/* ---------- 落地页容器 ---------- */
.landing {
  position: fixed;
  inset: 0;
  background: #000;
  overflow: hidden;
  height: 100vh;
  height: 100dvh;
}

/* ---------- 视频 ---------- */
.bg-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
}

/* ---------- 暗角：保证文字可读 ---------- */
.veil {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(ellipse 60% 55% at 50% 46%, rgba(0, 0, 0, 0.45), transparent 72%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.28), transparent 30%, transparent 62%, rgba(0, 0, 0, 0.5));
}

/* ---------- 内容 ---------- */
.landing-inner {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  gap: clamp(26px, 4.5vh, 44px);
}

/* ---------- 标题 ---------- */
.headline {
  margin: 0;
  font-family: "BubbledotICG-FinePos", "Geist Pixel Circle", monospace;
  font-size: clamp(30px, 6.4vw, 82px);
  font-weight: 400;
  letter-spacing: -0.04em;
  line-height: 1.12;
  color: #fff;
  text-align: center;
  white-space: nowrap;
}

.headline .line {
  display: block;
  opacity: 0;
  animation: lineFade 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.headline .line-1 { animation-delay: 0.12s; }
.headline .line-2 { animation-delay: 0.3s; }

/* ---------- 入口按钮 ---------- */
.entries {
  display: flex;
  align-items: center;
  gap: clamp(14px, 2.4vw, 24px);
  flex-wrap: wrap;
  justify-content: center;
  opacity: 0;
  animation: entriesIn 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.46s forwards;
}

.entry {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border-radius: 999px;
  font-family: "Inter", "Segoe UI", system-ui, sans-serif;
  font-size: clamp(14px, 1.5vw, 16px);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #fff;
  background: rgba(20, 20, 24, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s, border-color 0.3s, background 0.3s;
}

.entry-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 网络安全助手：青色强调 */
.entry-sec {
  border-color: rgba(0, 229, 255, 0.55);
}

.entry-sec .entry-icon {
  color: #4defff;
}

.entry-sec:hover {
  transform: translateY(-3px);
  background: rgba(0, 180, 220, 0.18);
  border-color: #00e5ff;
  box-shadow: 0 0 0 1px rgba(0, 229, 255, 0.25), 0 10px 34px rgba(0, 180, 220, 0.4);
}

/* 全能助手：紫色强调 */
.entry-super {
  border-color: rgba(139, 123, 255, 0.55);
}

.entry-super .entry-icon {
  color: #a99dff;
}

.entry-super:hover {
  transform: translateY(-3px);
  background: rgba(99, 86, 240, 0.2);
  border-color: #8b7bff;
  box-shadow: 0 0 0 1px rgba(139, 123, 255, 0.25), 0 10px 34px rgba(99, 86, 240, 0.42);
}

/* ---------- 动画 ---------- */
@keyframes lineFade {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes entriesIn {
  from { opacity: 0; transform: translateY(20px) scale(0.97); filter: blur(6px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}

/* ---------- 减少动效 ---------- */
@media (prefers-reduced-motion: reduce) {
  .headline .line,
  .entries {
    opacity: 1 !important;
    animation: none !important;
    transform: none !important;
    filter: none !important;
  }
}

/* ---------- 移动端 ---------- */
@media (max-width: 720px) {
  .headline {
    letter-spacing: -0.08em;
    line-height: 1.06;
  }

  .entries {
    flex-direction: column;
    width: 100%;
    max-width: 320px;
  }

  .entry {
    width: 100%;
    justify-content: center;
    padding: 14px 22px;
  }
}

@media (max-width: 420px) {
  .headline {
    letter-spacing: -0.09em;
    line-height: 1.04;
  }
}
</style>

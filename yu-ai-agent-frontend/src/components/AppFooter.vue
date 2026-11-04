<template>
  <footer class="app-footer">
    <p>© {{ currentYear }} Intelligence Designed To Evolve</p>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

// 计算当前年份
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  padding: 18px 0 20px;
  text-align: center;
  color: var(--text-low, rgba(176, 202, 238, 0.42));
  font-size: 12px;
  letter-spacing: 1px;
  font-family: var(--font-mono, monospace);
  width: 100%;
}

.app-footer p {
  margin: 0;
}
</style>

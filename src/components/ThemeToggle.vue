<template>
  <button class="theme-toggle" @click="toggleTheme" aria-label="切换主题">
    <svg v-if="theme === 'light'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '../composables/useTheme';

const { theme, toggleTheme } = useTheme();
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 2rem;
  right: 2rem;
  padding: 1rem;
  border-radius: 50%;
  background: var(--card-bg-light);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--border-color-light);
  box-shadow: var(--shadow-light);
  z-index: 1000;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-dark);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.theme-toggle svg {
  width: 24px;
  height: 24px;
  color: var(--text-color);
}

@media (max-width: 768px) {
  .theme-toggle {
    top: 1rem;
    right: 1rem;
    padding: 0.75rem;
  }

  .theme-toggle svg {
    width: 20px;
    height: 20px;
  }
}
</style>
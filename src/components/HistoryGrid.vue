<template>
  <div class="history-section">
    <h2 class="section-title">历史浏览</h2>
    <div v-if="history.length === 0" class="empty-history">
      <p>暂无浏览记录</p>
    </div>
    <div v-else class="history-grid">
      <div
        v-for="(item, index) in history"
        :key="item.id"
        class="history-card glass-effect animate-fade-in"
        :class="`stagger-${(index % 5) + 1}`"
        @click="handleCardClick(item)"
      >
        <h3 class="history-card-title">{{ item.title }}</h3>
        <p class="history-card-author">{{ item.author }} · {{ item.dynasty }}</p>
        <p class="history-card-preview">{{ item.content.join('，') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HistoryItem } from '../types/poetry';

interface Props {
  history: HistoryItem[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  select: [poetry: HistoryItem];
}>();

const handleCardClick = (item: HistoryItem) => {
  emit('select', item);
};
</script>

<style scoped>
.history-section {
  margin-bottom: 4rem;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--primary-color);
}

.empty-history {
  text-align: center;
  padding: 3rem;
  opacity: 0.6;
}

.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

@media (max-width: 768px) {
  .history-grid {
    grid-template-columns: 1fr;
  }
}

.history-card {
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.history-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-dark);
}

.history-card:active {
  transform: translateY(-4px);
}

.history-card-title {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.history-card-author {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 1rem;
}

.history-card-preview {
  font-size: 1rem;
  line-height: 1.8;
  opacity: 0.7;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: 'Noto Serif TC', serif;
}
</style>
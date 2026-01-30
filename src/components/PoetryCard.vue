<template>
  <div class="poetry-card glass-effect animate-fade-in">
    <div class="card-header">
      <button
        class="change-btn"
        @click="handleChangePoetry"
        :disabled="loading"
        aria-label="换一句诗词"
      >
        <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="23 4 23 10 17 10"></polyline>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
        <span v-else class="loading-spinner"></span>
        <span class="btn-text">换一句</span>
      </button>
    </div>

    <div class="card-body">
      <div class="poetry-header">
        <h2 class="poetry-title">{{ poetry.title }}</h2>
        <span class="poetry-dynasty">{{ poetry.dynasty }}</span>
      </div>

      <div class="poetry-content">
        <p v-for="(line, index) in poetry.content" :key="index" class="poetry-line">
          {{ line }}
        </p>
      </div>
    </div>

    <div class="card-footer">
      <span class="poetry-author">{{ poetry.author }}</span>
      <div class="action-buttons">
        <button class="action-btn share-btn" @click="handleShare" aria-label="分享">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </button>
        <button class="action-btn favorite-btn" @click="handleFavorite" aria-label="收藏">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Poetry } from '../types/poetry';

interface Props {
  poetry: Poetry;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'change': [];
}>();

const loading = ref(false);

const handleShare = async () => {
  const shareText = `《${props.poetry.title}》\n${props.poetry.content.join('\n')}\n—— ${props.poetry.author}（${props.poetry.dynasty}）`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: props.poetry.title,
        text: shareText
      });
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        console.error('Error sharing:', e);
      }
    }
  } else {
    try {
      await navigator.clipboard.writeText(shareText);
      alert('已复制到剪贴板！');
    } catch (e) {
      console.error('Error copying to clipboard:', e);
      alert('复制失败，请手动复制');
    }
  }
};

const handleFavorite = () => {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  const exists = favorites.some((fav: Poetry) => fav.id === props.poetry.id);

  if (!exists) {
    favorites.push(props.poetry);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('已收藏！');
  } else {
    alert('已经收藏过了');
  }
};

const handleChangePoetry = async () => {
  if (loading.value) return;
  
  loading.value = true;
  
  try {
    emit('change');
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }
};
</script>

<style scoped>
.poetry-card {
  position: relative;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-lg);
  transition: transform var(--transition-base) ease,
              box-shadow var(--transition-base) ease;
}

.poetry-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.card-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--spacing-lg);
}

.change-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--font-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base) ease;
  border: none;
}

.change-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

.change-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.change-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: var(--radius-full);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.btn-text {
  display: inline;
}

.card-body {
  margin-bottom: var(--spacing-xl);
}

.poetry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-light);
}

.poetry-title {
  font-size: var(--font-3xl);
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
  letter-spacing: 0.02em;
}

.poetry-dynasty {
  font-size: var(--font-sm);
  padding: var(--spacing-xs) var(--spacing-md);
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-radius: var(--radius-full);
  font-weight: 600;
  letter-spacing: 0.05em;
}

.poetry-content {
  text-align: center;
  font-size: var(--font-lg);
  line-height: 2;
  font-family: 'Noto Serif TC', serif;
  color: var(--text-primary);
}

.poetry-line {
  margin: var(--spacing-sm) 0;
  transition: color var(--transition-base) ease;
}

.poetry-line:hover {
  color: var(--primary-color);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-light);
}

.poetry-author {
  font-size: var(--font-base);
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.02em;
}

.action-buttons {
  display: flex;
  gap: var(--spacing-md);
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm);
  background: transparent;
  border: 2px solid var(--border-secondary);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-base) ease;
}

.action-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: rgba(139, 69, 19, 0.05);
  transform: translateY(-2px);
}

.action-btn:active {
  transform: translateY(0);
}

.share-btn,
.favorite-btn {
  width: 40px;
  height: 40px;
}

@media (max-width: 768px) {
  .poetry-card {
    padding: var(--spacing-lg);
  }
  
  .poetry-title {
    font-size: var(--font-2xl);
  }
  
  .poetry-content {
    font-size: var(--font-base);
  }
  
  .poetry-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;
  }
  
  .card-footer {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .action-buttons {
    width: 100%;
  }
  
  .action-btn {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .poetry-title {
    font-size: var(--font-xl);
  }
  
  .poetry-content {
    font-size: var(--font-sm);
    line-height: 1.8;
  }
}
</style>

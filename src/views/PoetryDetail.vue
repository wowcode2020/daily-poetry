<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import PoetryCard from '../components/PoetryCard.vue';
import type { Poetry } from '../types/poetry';
import poetryDatabase from '../data/poetryDatabase.json';
import poetryExplanations from '../data/poetryExplanations.json';

const route = useRoute();

const poetry = ref<Poetry | null>(null);
const loading = ref(true);

const relatedPoetry = computed(() => {
  if (!poetry.value) return [];
  
  return poetryDatabase.poetry
    .filter(p => 
      p.id !== poetry.value?.id && (
        p.author === poetry.value?.author ||
        p.dynasty === poetry.value?.dynasty ||
        p.tags?.some(tag => poetry.value?.tags?.includes(tag))
      )
    )
    .slice(0, 4);
});

const explanation = computed(() => {
  if (!poetry.value) return null;
  return (poetryExplanations.explanations as Record<string, any>)[poetry.value.title] || null;
});

const navigateToPoetry = (id: string) => {
  window.location.href = `/poetry/${id}`;
};

const goBack = () => {
  window.location.href = '/library';
};

const fetchPoetry = () => {
  const id = route.params.id as string;
  
  const found = poetryDatabase.poetry.find(p => p.id === id);
  
  if (found) {
    poetry.value = found;
  } else {
    window.location.href = '/library';
  }
  
  loading.value = false;
};

onMounted(() => {
  fetchPoetry();
});
</script>

<template>
  <div class="poetry-detail">
    <div class="container">
      <div class="back-nav">
        <button class="back-btn" @click="goBack" aria-label="返回">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          返回
        </button>
      </div>

      <main v-if="loading" class="loading">
        <div class="loading-spinner"></div>
      </main>

      <main v-else-if="poetry" class="detail-content">
        <PoetryCard :poetry="poetry" />
        
        <section v-if="explanation" class="explanation-section">
          <h2 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            诗词解析
          </h2>
          
          <div class="explanation-content">
            <div v-if="explanation.background" class="explanation-block">
              <h3>创作背景</h3>
              <p>{{ explanation.background }}</p>
            </div>
            
            <div v-if="explanation.authorInfo" class="explanation-block">
              <h3>作者简介</h3>
              <p>{{ explanation.authorInfo }}</p>
            </div>
            
            <div v-if="explanation.keyWords" class="explanation-block">
              <h3>关键词解释</h3>
              <div class="keywords-grid">
                <div v-for="(meaning, word) in explanation.keyWords" :key="word" class="keyword-item">
                  <span class="keyword">{{ word }}</span>
                  <span class="meaning">{{ meaning }}</span>
                </div>
              </div>
            </div>
            
            <div v-if="explanation.interpretation" class="explanation-block">
              <h3>诗词赏析</h3>
              <p>{{ explanation.interpretation }}</p>
            </div>
            
            <div v-if="explanation.mood" class="explanation-block">
              <h3>情感基调</h3>
              <div class="mood-tags">
                <span v-for="mood in explanation.mood.split('、')" :key="mood" class="mood-tag">
                  {{ mood }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section v-if="relatedPoetry.length > 0" class="related-section">
          <h2 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            相关诗词
          </h2>
          
          <div class="related-grid">
            <div
              v-for="related in relatedPoetry"
              :key="related.id"
              class="related-card glass-effect"
              @click="navigateToPoetry(related.id)"
            >
              <h3>{{ related.title }}</h3>
              <p>{{ related.author }} · {{ related.dynasty }}</p>
              <p class="preview">{{ related.content[0] }}</p>
            </div>
          </div>
        </section>
      </main>

      <footer class="footer">
        <p>每日诗词 - 诗词详情</p>
        <p>诗词数据来源：<a href="https://www.jinrishici.com" target="_blank">今日诗词 API</a></p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.poetry-detail {
  min-height: 100vh;
  position: relative;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-3xl) var(--spacing-lg);
}

.back-nav {
  margin-bottom: var(--spacing-xl);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-card);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: var(--font-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base) ease;
}

.back-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: rgba(139, 69, 19, 0.05);
  transform: translateY(-2px);
}

.back-btn svg {
  flex-shrink: 0;
  transition: transform var(--transition-base) ease;
}

.back-btn:hover svg {
  transform: translateX(-3px);
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid var(--border-color-light);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.detail-content {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-2xl);
}

.explanation-section {
  margin-top: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.05) 0%, rgba(255, 107, 107, 0.05) 100%);
  border-radius: 16px;
  border: 1px solid rgba(74, 144, 226, 0.1);
}

.explanation-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.explanation-block {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.explanation-block h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-color);
  border-bottom: 2px solid rgba(74, 144, 226, 0.2);
  padding-bottom: 0.5rem;
}

.explanation-block p {
  margin: 0;
  line-height: 1.8;
  color: #333;
  font-size: 0.95rem;
}

.keywords-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.keyword-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;
  background: rgba(74, 144, 226, 0.05);
  border-radius: 8px;
  border-left: 3px solid var(--primary-color);
}

.keyword-item .keyword {
  font-weight: 600;
  color: var(--primary-color);
  font-size: 0.95rem;
}

.keyword-item .meaning {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.5;
}

.mood-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.mood-tag {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.related-section {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid var(--border-color-light);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
}

.section-title svg {
  color: var(--accent-color);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.related-card {
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.related-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-dark);
}

.related-card h3 {
  font-size: 1.1rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.related-card p {
  font-size: 0.9rem;
  opacity: 0.7;
  margin: 0.25rem 0;
}

.related-card .preview {
  font-family: 'Noto Serif TC', serif;
  opacity: 0.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.footer {
  text-align: center;
  padding: 3rem 2rem;
  margin-top: 4rem;
  border-top: 1px solid var(--border-color-light);
}

.footer p {
  margin: 0.5rem 0;
  opacity: 0.8;
}

.footer a {
  color: var(--primary-color);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .detail-content {
    padding: 0 1rem;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>
<template>
  <div class="poetry-explanation glass-effect">
    <div class="explanation-header">
      <h3 class="explanation-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
        诗词赏析
      </h3>
    </div>

    <div class="explanation-content">
      <div v-if="explanation" class="explanation-sections">
        <section class="section">
          <h4 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            诗词背景
          </h4>
          <p class="section-content">{{ explanation.background }}</p>
        </section>

        <section class="section">
          <h4 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            作者简介
          </h4>
          <p class="section-content">{{ explanation.authorInfo }}</p>
        </section>

        <section v-if="explanation.keyWords" class="section">
          <h4 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="4 7 4 4 20 4 20 7"></polyline>
              <line x1="9" y1="20" x2="15" y2="20"></line>
              <line x1="12" y1="4" x2="12" y2="20"></line>
            </svg>
            重点字词注释
          </h4>
          <div class="keywords-list">
            <div v-for="(meaning, word) in explanation.keyWords" :key="word" class="keyword-item">
              <span class="keyword-word">{{ word }}</span>
              <span class="keyword-meaning">{{ meaning }}</span>
            </div>
          </div>
        </section>

        <section class="section">
          <h4 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
            意境解析
          </h4>
          <p class="section-content">{{ explanation.interpretation }}</p>
        </section>

        <section v-if="explanation.mood" class="section">
          <h4 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
            情感基调
          </h4>
          <div class="mood-tags">
            <span v-for="mood in explanation.mood.split('、')" :key="mood" class="mood-tag">
              {{ mood }}
            </span>
          </div>
        </section>
      </div>

      <div v-else class="no-explanation">
        <p>暂无详细解释</p>
        <p class="hint">您可以点击下方按钮搜索诗词赏析</p>
        <button class="search-btn" @click="searchExplanation">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          搜索更多赏析
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Poetry, ExplanationsData } from '../types/poetry';
import rawExplanationsData from '../data/poetryExplanations.json';

const explanationsData = rawExplanationsData as unknown as ExplanationsData;

interface Props {
  poetry: Poetry;
}

const props = defineProps<Props>();

const explanation = computed(() => {
  if (explanationsData.explanations && props.poetry.title) {
    return explanationsData.explanations[props.poetry.title] || null;
  }
  return null;
});

const searchExplanation = () => {
  const searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(props.poetry.title + ' ' + props.poetry.author + ' 赏析')}`;
  window.open(searchUrl, '_blank');
};
</script>

<style scoped>
.poetry-explanation {
  margin-top: 2rem;
  overflow: hidden;
}

.explanation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color-light);
}

.explanation-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: var(--primary-color);
  margin: 0;
}

.explanation-content {
  padding: 1.5rem;
}

.explanation-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color-light);
}

.section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: var(--primary-color);
  margin-bottom: 0.75rem;
}

.section-title svg {
  opacity: 0.7;
}

.section-content {
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--text-color);
  opacity: 0.9;
  margin: 0;
}

.keywords-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.keyword-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(219, 39, 119, 0.05);
  border-radius: 8px;
}

.keyword-word {
  font-weight: 600;
  color: var(--primary-color);
  white-space: nowrap;
}

.keyword-meaning {
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.8;
}

.mood-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.mood-tag {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
}

.no-explanation {
  text-align: center;
  padding: 2rem;
}

.no-explanation p {
  margin: 0.5rem 0;
}

.hint {
  font-size: 0.9rem;
  opacity: 0.7;
}

.search-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(219, 39, 119, 0.3);
}

@media (max-width: 768px) {
  .explanation-header {
    padding: 1rem;
  }

  .explanation-content {
    padding: 1rem;
  }

  .keywords-list {
    grid-template-columns: 1fr;
  }
}
</style>
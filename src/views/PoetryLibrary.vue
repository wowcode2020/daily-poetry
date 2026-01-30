<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { PoetrySearchService } from '../services/searchService';
import poetryDatabase from '../data/poetryDatabase.json';
import type { Poetry } from '../types/poetry';

const router = useRouter();
const route = useRoute();
const poetrySearchService = PoetrySearchService.getInstance();

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 12;
const showSearchResults = ref(false);

onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search as string;
    showSearchResults.value = true;
  }
});

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return [];
  return poetrySearchService.search(searchQuery.value, { limit: 100 });
});

const displayedPoetry = computed(() => {
  if (showSearchResults.value && searchResults.value.length > 0) {
    return searchResults.value.map(r => r.poetry);
  }
  return poetryDatabase.poetry;
});

const paginatedPoetry = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return displayedPoetry.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(displayedPoetry.value.length / itemsPerPage);
});

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    showSearchResults.value = false;
    return;
  }
  showSearchResults.value = true;
  currentPage.value = 1;
};

const clearSearch = () => {
  searchQuery.value = '';
  showSearchResults.value = false;
  currentPage.value = 1;
};

const handlePoetryClick = (poetry: Poetry) => {
  router.push(`/poetry/${poetry.id}`);
};

const goToPage = (page: number) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <div class="poetry-library">
    <div class="container">
      <header class="library-header">
        <h1 class="page-title animate-slide-up">诗词大全</h1>
        
        <div class="search-container">
          <div class="search-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="搜索诗词、作者、关键词..."
              class="search-input"
              @keyup.enter="handleSearch"
            />
            <button v-if="searchQuery" class="clear-search-btn" @click="clearSearch" aria-label="清除搜索">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div v-if="showSearchResults" class="search-info animate-fade-in">
        <p class="result-count">找到 {{ searchResults.length }} 首相关诗词</p>
        <button class="clear-all-btn" @click="clearSearch">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          清除搜索
        </button>
      </div>

      <div v-if="paginatedPoetry.length === 0" class="empty-state animate-fade-in">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </div>
        <p class="empty-title">暂无诗词</p>
        <p class="empty-description">请尝试其他搜索关键词</p>
      </div>

      <div v-else class="poetry-grid animate-fade-in">
        <div
          v-for="(poetry, index) in paginatedPoetry"
          :key="poetry.id"
          class="poetry-card glass-effect"
          :style="{ animationDelay: `${index * 50}ms` }"
          @click="handlePoetryClick(poetry)"
        >
          <h3 class="poetry-title">{{ poetry.title }}</h3>
          <p class="poetry-meta">{{ poetry.author }} · {{ poetry.dynasty }}</p>
          <p class="poetry-preview">{{ poetry.content[0] }}</p>
          <div v-if="poetry.tags && poetry.tags.length > 0" class="poetry-tags">
            <span v-for="tag in poetry.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="pagination animate-fade-in">
        <button
          class="pagination-btn"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
          aria-label="上一页"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          上一页
        </button>
        
        <div class="page-numbers">
          <button
            v-for="page in totalPages"
            :key="page"
            class="page-number"
            :class="{ active: page === currentPage, nearby: Math.abs(page - currentPage) <= 2 }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>
        
        <button
          class="pagination-btn"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
          aria-label="下一页"
        >
          下一页
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.poetry-library {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-top: calc(var(--spacing-3xl) + 60px);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.library-header {
  margin-bottom: var(--spacing-2xl);
  text-align: center;
}

.page-title {
  font-size: var(--font-4xl);
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xl);
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--secondary-color)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.05em;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-wrapper {
  display: flex;
  align-items: center;
  background: var(--bg-card);
  border: 2px solid var(--border-secondary);
  border-radius: var(--radius-full);
  padding: var(--spacing-sm) var(--spacing-md);
  transition: all var(--transition-base) ease;
  box-shadow: var(--shadow-sm);
}

.search-wrapper:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
}

.search-wrapper svg {
  color: var(--text-muted);
  flex-shrink: 0;
  transition: color var(--transition-base) ease;
}

.search-wrapper:focus-within svg {
  color: var(--primary-color);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: var(--spacing-sm);
  font-size: var(--font-base);
  color: var(--text-primary);
  outline: none;
}

.search-input::placeholder {
  color: var(--text-muted);
  opacity: 0.7;
}

.clear-search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm);
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  transition: all var(--transition-base) ease;
  border-radius: var(--radius-md);
}

.clear-search-btn:hover {
  background: rgba(139, 69, 19, 0.05);
  color: var(--primary-color);
}

.search-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-md) var(--spacing-lg);
  background: rgba(139, 69, 19, 0.05);
  border-radius: var(--radius-lg);
}

.result-count {
  font-size: var(--font-base);
  color: var(--text-secondary);
  font-weight: 500;
}

.clear-all-btn {
  display: flex;
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

.clear-all-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: rgba(139, 69, 19, 0.05);
  transform: translateY(-2px);
}

.clear-all-btn svg {
  flex-shrink: 0;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-lg);
}

.empty-icon {
  margin-bottom: var(--spacing-xl);
  color: var(--text-muted);
  opacity: 0.5;
}

.empty-title {
  font-size: var(--font-2xl);
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}

.empty-description {
  font-size: var(--font-base);
  color: var(--text-muted);
  opacity: 0.8;
}

.poetry-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.poetry-card {
  background: var(--bg-card) !important;
  border-radius: var(--radius-xl) !important;
  padding: var(--spacing-xl) !important;
  cursor: pointer;
  transition: all var(--transition-base) ease;
  border: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  opacity: 0;
  animation: fadeIn var(--transition-slower) ease-out forwards;
  min-width: 400px !important;
}

.poetry-card:hover {
  transform: translateY(-6px) !important;
  box-shadow: var(--shadow-xl) !important;
  border-color: var(--primary-color) !important;
}

.poetry-title {
  font-size: var(--font-xl);
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
  line-height: 1.4;
}

.poetry-meta {
  font-size: var(--font-sm);
  color: var(--text-muted);
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.poetry-preview {
  font-size: var(--font-base);
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  font-family: 'Noto Serif TC', serif;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.poetry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.tag {
  font-size: var(--font-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(139, 69, 19, 0.1);
  color: var(--primary-color);
  border-radius: var(--radius-full);
  font-weight: 500;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-3xl);
  padding: var(--spacing-lg);
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.pagination-btn {
  display: flex;
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

.pagination-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: rgba(139, 69, 19, 0.05);
  transform: translateY(-2px);
}

.pagination-btn:active:not(:disabled) {
  transform: translateY(0);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-btn svg {
  flex-shrink: 0;
}

.page-numbers {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  justify-content: center;
}

.page-number {
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-card);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: var(--font-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base) ease;
}

.page-number:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
}

.page-number.active {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-color: transparent;
  font-weight: 600;
}

.page-number.nearby {
  border-color: var(--border-primary);
}

@media (max-width: 1200px) {
  .poetry-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 var(--spacing-md);
  }
  
  .page-title {
    font-size: var(--font-3xl);
  }
  
  .poetry-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .poetry-card {
    padding: var(--spacing-lg);
  }
  
  .pagination {
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }
  
  .page-numbers {
    display: none;
  }
}

@media (max-width: 480px) {
  .search-container {
    max-width: 100%;
  }
  
  .search-wrapper {
    padding: var(--spacing-xs) var(--spacing-sm);
  }
  
  .search-input::placeholder {
    font-size: var(--font-sm);
  }
  
  .page-title {
    font-size: var(--font-2xl);
  }
}
</style>

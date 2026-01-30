<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input
        type="text"
        v-model="searchQuery"
        :placeholder="placeholder"
        class="search-input"
        @input="handleSearch"
        @focus="showResults = true"
      />
      <button v-if="searchQuery" class="clear-btn" @click="clearSearch">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <div v-if="showResults && (searchResults.length > 0 || searchQuery)" class="search-results glass-effect">
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
      </div>

      <div v-else-if="searchResults.length > 0" class="results-list">
        <div
          v-for="poetry in searchResults"
          :key="poetry.id"
          class="result-item"
          @click="selectPoetry(poetry)"
        >
          <div class="result-title">{{ poetry.title }}</div>
          <div class="result-author">{{ poetry.author }} · {{ poetry.dynasty }}</div>
          <div class="result-preview">{{ poetry.content.slice(0, 2).join('，') }}</div>
        </div>
      </div>

      <div v-else-if="searchQuery" class="no-results">
        没有找到相关诗词
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Poetry } from '../types/poetry';
import backupData from '../data/backupPoetry.json';

interface Props {
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '搜索诗词、作者...'
});

const emit = defineEmits<{
  select: [poetry: Poetry];
}>();

const searchQuery = ref('');
const searchResults = ref<Poetry[]>([]);
const loading = ref(false);
const showResults = ref(false);

let searchTimeout: ReturnType<typeof setTimeout>;

const handleSearch = () => {
  clearTimeout(searchTimeout);

  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  searchTimeout = setTimeout(() => {
    performSearch();
  }, 300);
};

const performSearch = () => {
  loading.value = true;
  const query = searchQuery.value.toLowerCase().trim();

  const results = backupData.poetry.filter(poetry => {
    return (
      poetry.title.toLowerCase().includes(query) ||
      poetry.author.toLowerCase().includes(query) ||
      poetry.content.some(line => line.toLowerCase().includes(query)) ||
      poetry.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  searchResults.value = results.slice(0, 10);
  loading.value = false;
};

const selectPoetry = (poetry: Poetry) => {
  emit('select', poetry);
  showResults.value = false;
  searchQuery.value = '';
};

const clearSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
  showResults.value = false;
};

watch(() => props.placeholder, (newVal) => {
  console.log('Placeholder changed:', newVal);
});
</script>

<style scoped>
.search-bar {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: var(--text-color);
  opacity: 0.5;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 1rem 3rem;
  font-size: 1rem;
  border: 2px solid var(--border-color-light);
  border-radius: 50px;
  background: var(--card-bg-light);
  backdrop-filter: blur(10px);
  color: var(--text-color);
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(219, 39, 119, 0.1);
}

.search-input::placeholder {
  color: var(--text-color);
  opacity: 0.5;
}

.clear-btn {
  position: absolute;
  right: 1rem;
  padding: 0.25rem;
  background: none;
  border: none;
  color: var(--text-color);
  opacity: 0.5;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.clear-btn:hover {
  opacity: 1;
}

.search-results {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
}

.results-list {
  padding: 0.5rem;
}

.result-item {
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
}

.result-item:hover {
  background: rgba(219, 39, 119, 0.1);
}

.result-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.result-author {
  font-size: 0.9rem;
  opacity: 0.7;
  margin-bottom: 0.5rem;
}

.result-preview {
  font-size: 0.9rem;
  opacity: 0.6;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.loading-spinner {
  width: 30px;
  height: 30px;
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

.no-results {
  padding: 2rem;
  text-align: center;
  opacity: 0.6;
}

@media (max-width: 768px) {
  .search-bar {
    padding: 0 1rem;
  }

  .search-input {
    font-size: 0.9rem;
    padding: 0.75rem 2.5rem;
  }

  .search-icon {
    left: 0.75rem;
  }

  .clear-btn {
    right: 0.75rem;
  }
}
</style>
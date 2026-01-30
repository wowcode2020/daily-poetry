<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import backupData from '../data/backupPoetry.json';
import rawExplanations from '../data/poetryExplanations.json';
import type { Poetry } from '../types/poetry';

interface Explanation {
  background: string;
  authorInfo: string;
  keyWords?: Record<string, string>;
  interpretation: string;
  mood?: string;
}

const explanationsData = rawExplanations as unknown as Record<string, Explanation>;

const router = useRouter();
const route = useRoute();

const searchQuery = ref('');
const searchResults = ref<Poetry[]>([]);
const selectedPoetry = ref<Poetry | null>(null);
const isSearching = ref(false);
const activeTab = ref('content');
const networkSearchResults = ref<any[]>([]);
const isNetworkSearching = ref(false);

const popularPoetry = computed(() => {
  const shuffled = [...backupData.poetry].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 8);
});

const searchPoetry = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;
  const query = searchQuery.value.toLowerCase().trim();
  
  const localResults = backupData.poetry.filter(poetry =>
    poetry.title.toLowerCase().includes(query) ||
    poetry.author.toLowerCase().includes(query) ||
    poetry.content.some(line => line.toLowerCase().includes(query)) ||
    poetry.tags?.some(tag => tag.toLowerCase().includes(query))
  );
  
  searchResults.value = localResults;
  
  if (localResults.length === 0) {
    searchNetwork(query);
  }
  
  isSearching.value = false;
};

const searchNetwork = async (_query: string) => {
  isNetworkSearching.value = true;
  networkSearchResults.value = [];
  
  try {
    const response = await fetch(
      `https://v2.jinrishici.com/one.json?token=&source=web`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data && data.data && data.data.origin) {
        const poetryData = {
          title: data.data.origin.title || '无题',
          content: data.data.content || data.data.origin.content || [],
          author: data.data.origin.author || '佚名',
          dynasty: data.data.origin.dynasty || '未知'
        };
        networkSearchResults.value = [poetryData];
      }
    }
  } catch (error) {
    console.error('网络搜索失败:', error);
  } finally {
    isNetworkSearching.value = false;
  }
};

const selectPoetry = (poetry: Poetry) => {
  selectedPoetry.value = poetry;
  searchResults.value = [];
  searchQuery.value = '';
  activeTab.value = 'content';
  
  router.push(`/poetry/${poetry.id}`);
};

const getExplanation = (title: string): Explanation | null => {
  if (explanationsData && title) {
    return explanationsData[title] || null;
  }
  return null;
};

const explanation = computed(() => {
  if (!selectedPoetry.value) return null;
  return getExplanation(selectedPoetry.value.title);
});

watch(() => route.params.id, (newId) => {
  if (newId) {
    const poetry = backupData.poetry.find(p => p.id === newId);
    if (poetry) {
      selectedPoetry.value = poetry;
    }
  }
}, { immediate: true });

const clearSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
  networkSearchResults.value = [];
};

const tabs = [
  { id: 'content', name: '诗词原文', icon: '📖' },
  { id: 'words', name: '字词解析', icon: '🔤' },
  { id: 'analysis', name: '全文赏析', icon: '📝' },
  { id: 'author', name: '作者简介', icon: '👤' }
];
</script>

<template>
  <div class="appreciation">
    <div class="container">
      <header class="page-header">
        <h1 class="page-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          诗词鉴赏
        </h1>
        <p class="page-subtitle">深入品味诗词之美，细读字里行间的意境与情感</p>
      </header>

      <main class="page-content">
        <section class="search-section glass-effect">
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="输入诗词标题、作者或关键词进行搜索和鉴赏..."
              class="search-input"
              @keyup.enter="searchPoetry"
            />
            <button class="search-btn" @click="searchPoetry" :disabled="isSearching">
              {{ isSearching ? '搜索中...' : '搜索' }}
            </button>
          </div>

          <div v-if="searchResults.length > 0" class="search-results">
            <div class="results-header">
              <span>搜索结果 ({{ searchResults.length }})</span>
              <button class="clear-btn" @click="clearSearch">清除</button>
            </div>
            <div class="results-grid">
              <div
                v-for="poetry in searchResults"
                :key="poetry.id"
                class="result-card"
                @click="selectPoetry(poetry)"
              >
                <h3>{{ poetry.title }}</h3>
                <p>{{ poetry.author }} · {{ poetry.dynasty }}</p>
                <p class="preview">{{ poetry.content[0] }}</p>
              </div>
            </div>
          </div>

          <div v-if="networkSearchResults.length > 0" class="network-results">
            <h3>网络搜索结果</h3>
            <div
              v-for="(result, index) in networkSearchResults"
              :key="index"
              class="result-card network"
            >
              <h3>{{ result.title }}</h3>
              <p>{{ result.author }} · {{ result.dynasty }}</p>
              <p class="preview">{{ result.content[0] }}</p>
            </div>
          </div>
        </section>

        <section v-if="selectedPoetry" class="poetry-section glass-effect">
          <div class="poetry-header">
            <h2 class="poetry-title">{{ selectedPoetry.title }}</h2>
            <div class="poetry-meta">
              <span class="author">{{ selectedPoetry.author }}</span>
              <span class="dynasty">{{ selectedPoetry.dynasty }}</span>
            </div>
          </div>

          <div class="tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="tab-btn"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              <span class="tab-icon">{{ tab.icon }}</span>
              {{ tab.name }}
            </button>
          </div>

          <div class="tab-content">
            <div v-if="activeTab === 'content'" class="content-tab">
              <div class="poetry-content">
                <p v-for="(line, index) in selectedPoetry.content" :key="index" class="line">
                  {{ line }}
                </p>
              </div>
              <div class="tags">
                <span v-for="tag in selectedPoetry.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>

            <div v-if="activeTab === 'words'" class="words-tab">
              <div v-if="explanation?.keyWords" class="words-list">
                <div v-for="(meaning, word) in explanation.keyWords" :key="word" class="word-item">
                  <span class="word">{{ word }}</span>
                  <span class="meaning">{{ meaning }}</span>
                </div>
              </div>
              <div v-else class="no-content">
                <p>暂无字词注释数据</p>
                <p class="hint">您可以搜索其他诗词查看注释</p>
              </div>
            </div>

            <div v-if="activeTab === 'analysis'" class="analysis-tab">
              <div v-if="explanation" class="analysis-content">
                <div class="analysis-section">
                  <h3>诗词背景</h3>
                  <p>{{ explanation.background }}</p>
                </div>
                <div class="analysis-section">
                  <h3>意境解析</h3>
                  <p>{{ explanation.interpretation }}</p>
                </div>
                <div v-if="explanation.mood" class="analysis-section">
                  <h3>情感基调</h3>
                  <p>{{ explanation.mood }}</p>
                </div>
              </div>
              <div v-else class="no-content">
                <p>暂无赏析数据</p>
                <p class="hint">您可以搜索其他诗词查看赏析</p>
              </div>
            </div>

            <div v-if="activeTab === 'author'" class="author-tab">
              <div v-if="explanation" class="author-info">
                <h3>作者简介</h3>
                <p>{{ explanation.authorInfo }}</p>
              </div>
              <div v-else class="no-content">
                <p>暂无作者信息</p>
                <p class="hint">您可以查看作者名录获取更多信息</p>
              </div>
            </div>
          </div>
        </section>

        <section v-if="!selectedPoetry" class="popular-section">
          <h2 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            精选推荐
          </h2>
          <div class="popular-grid">
            <div
              v-for="poetry in popularPoetry"
              :key="poetry.id"
              class="popular-card"
              @click="selectPoetry(poetry)"
            >
              <h3>{{ poetry.title }}</h3>
              <p>{{ poetry.author }} · {{ poetry.dynasty }}</p>
              <p class="preview">{{ poetry.content[0] }}</p>
            </div>
          </div>
        </section>
      </main>

      <footer class="footer">
        <p>诗词中国 - 诗词鉴赏</p>
        <p>传承中华文化，品味诗词之美</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.appreciation {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-header {
  text-align: center;
  padding: 3rem 2rem;
}

.page-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.page-title svg {
  color: var(--secondary-color);
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.7;
}

.page-content {
  padding-bottom: 4rem;
}

.search-section {
  padding: 2rem;
  margin-bottom: 2rem;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(219, 39, 119, 0.05);
  border: 2px solid var(--border-color-light);
  border-radius: 30px;
  padding: 0.5rem 0.5rem 0.5rem 1.5rem;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  border-color: var(--primary-color);
  background: white;
  box-shadow: 0 0 0 4px rgba(219, 39, 119, 0.1);
}

.search-box svg {
  color: var(--text-color);
  opacity: 0.6;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.75rem;
  font-size: 1rem;
  color: var(--text-color);
  outline: none;
}

.search-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.search-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.search-results {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color-light);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: var(--text-color);
  opacity: 0.8;
}

.clear-btn {
  padding: 0.4rem 1rem;
  background: transparent;
  border: 1px solid var(--border-color-light);
  border-radius: 15px;
  color: var(--text-color);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.result-card {
  padding: 1rem;
  background: var(--card-bg-light);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-dark);
}

.result-card h3 {
  font-size: 1.1rem;
  color: var(--primary-color);
  margin: 0 0 0.25rem 0;
}

.result-card p {
  font-size: 0.85rem;
  opacity: 0.7;
  margin: 0.25rem 0;
}

.result-card.preview {
  font-family: 'Noto Serif TC', serif;
  opacity: 0.6;
}

.result-card.network {
  border: 2px solid var(--accent-color);
}

.network-results {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color-light);
}

.network-results h3 {
  font-size: 1rem;
  color: var(--accent-color);
  margin-bottom: 1rem;
}

.poetry-section {
  padding: 2rem;
  margin-bottom: 2rem;
}

.poetry-header {
  text-align: center;
  margin-bottom: 2rem;
}

.poetry-title {
  font-size: 2rem;
  color: var(--primary-color);
  margin: 0 0 0.5rem 0;
}

.poetry-meta {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.poetry-meta .author {
  font-size: 1.1rem;
  color: var(--text-color);
}

.poetry-meta .dynasty {
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-radius: 15px;
  font-size: 0.85rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--card-bg-light);
  border: 1px solid var(--border-color-light);
  border-radius: 25px;
  color: var(--text-color);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.tab-btn.active {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-color: transparent;
}

.tab-icon {
  font-size: 1.1rem;
}

.tab-content {
  min-height: 200px;
}

.poetry-content {
  text-align: center;
}

.poetry-content .line {
  font-size: 1.4rem;
  line-height: 2;
  font-family: 'Noto Serif TC', serif;
  margin: 0.5rem 0;
}

.tags {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.4rem 1rem;
  background: rgba(219, 39, 119, 0.1);
  border-radius: 15px;
  font-size: 0.85rem;
  color: var(--primary-color);
}

.words-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.word-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--card-bg-light);
  border-radius: 12px;
}

.word {
  font-weight: 600;
  color: var(--primary-color);
  white-space: nowrap;
}

.meaning {
  font-size: 0.95rem;
  color: var(--text-color);
  opacity: 0.8;
}

.analysis-content,
.author-info {
  line-height: 1.8;
}

.analysis-section {
  margin-bottom: 1.5rem;
}

.analysis-section h3 {
  font-size: 1.1rem;
  color: var(--primary-color);
  margin: 0 0 0.75rem 0;
}

.analysis-section p,
.author-info p {
  font-size: 1rem;
  color: var(--text-color);
  opacity: 0.9;
  margin: 0;
}

.no-content {
  text-align: center;
  padding: 3rem;
  color: var(--text-color);
  opacity: 0.7;
}

.no-content .hint {
  font-size: 0.9rem;
  opacity: 0.6;
  margin-top: 0.5rem;
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

.popular-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.popular-card {
  padding: 1.5rem;
  background: var(--card-bg-light);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.popular-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-dark);
}

.popular-card h3 {
  font-size: 1.1rem;
  color: var(--primary-color);
  margin: 0 0 0.25rem 0;
}

.popular-card p {
  font-size: 0.9rem;
  opacity: 0.7;
  margin: 0.25rem 0;
}

.popular-card .preview {
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
  border-top: 1px solid var(--border-color-light);
}

.footer p {
  margin: 0.5rem 0;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .search-box {
    flex-wrap: wrap;
    border-radius: 20px;
  }

  .search-input {
    width: 100%;
    order: -1;
    margin-bottom: 0.5rem;
  }

  .search-btn {
    width: 100%;
    border-radius: 20px;
  }

  .tabs {
    justify-content: flex-start;
  }

  .tab-btn {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }

  .poetry-content .line {
    font-size: 1.2rem;
  }

  .results-grid,
  .popular-grid {
    grid-template-columns: 1fr;
  }
}
</style>
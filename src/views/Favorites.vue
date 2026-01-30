<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { Poetry } from '../types/poetry';

const router = useRouter();
const favorites = ref<Poetry[]>([]);

const loadFavorites = () => {
  try {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      favorites.value = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load favorites:', e);
  }
};

const removeFavorite = (poetry: Poetry) => {
  const index = favorites.value.findIndex(f => f.id === poetry.id);
  if (index !== -1) {
    favorites.value.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites.value));
  }
};

const handlePoetryClick = (poetry: Poetry) => {
  router.push(`/poetry/${poetry.id}`);
};

onMounted(() => {
  loadFavorites();
});
</script>

<template>
  <div class="favorites">
    <div class="container">
      <header class="favorites-header">
        <h1 class="favorites-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          我的收藏
        </h1>
        <p class="favorites-subtitle">共收藏 {{ favorites.length }} 首诗词</p>
      </header>

      <main v-if="favorites.length > 0" class="favorites-content">
        <div class="favorites-grid">
          <div
            v-for="poetry in favorites"
            :key="poetry.id"
            class="favorite-card glass-effect"
          >
            <div class="card-header">
              <h3 class="poetry-title">{{ poetry.title }}</h3>
              <button class="remove-btn" @click="removeFavorite(poetry)" title="取消收藏">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <p class="poetry-author">{{ poetry.author }} · {{ poetry.dynasty }}</p>
            <p class="poetry-content" @click="handlePoetryClick(poetry)">
              {{ poetry.content[0] }}
            </p>
            <div class="card-actions">
              <button class="view-btn" @click="handlePoetryClick(poetry)">
                查看详情
              </button>
            </div>
          </div>
        </div>
      </main>

      <main v-else class="empty-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <h2>还没有收藏的诗词</h2>
        <p>去诗词库浏览并收藏你喜欢的诗词吧</p>
        <router-link to="/library" class="browse-btn">
          浏览诗词库
        </router-link>
      </main>

      <footer class="footer">
        <p>每日诗词 - 我的收藏</p>
        <p>诗词数据来源：<a href="https://www.jinrishici.com" target="_blank">今日诗词 API</a></p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.favorites {
  min-height: 100vh;
  position: relative;
}

.favorites-header {
  text-align: center;
  padding: 3rem 2rem;
}

.favorites-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.favorites-title svg {
  color: #e11d48;
}

.favorites-subtitle {
  font-size: 1rem;
  opacity: 0.7;
}

.favorites-content {
  max-width: 1200px;
  margin: 0 auto;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.favorite-card {
  padding: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.poetry-title {
  font-size: 1.2rem;
  color: var(--primary-color);
  margin: 0;
}

.remove-btn {
  padding: 0.25rem;
  background: none;
  border: none;
  color: var(--text-color);
  opacity: 0.5;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  opacity: 1;
  color: #e11d48;
}

.poetry-author {
  font-size: 0.9rem;
  opacity: 0.7;
  margin-bottom: 0.75rem;
}

.poetry-content {
  font-size: 1rem;
  line-height: 1.6;
  font-family: 'Noto Serif TC', serif;
  opacity: 0.8;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.poetry-content:hover {
  color: var(--primary-color);
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  flex: 1;
  padding: 0.75rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 15px rgba(219, 39, 119, 0.3);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.empty-state h2 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.empty-state p {
  opacity: 0.7;
  margin-bottom: 1.5rem;
}

.browse-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.browse-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(219, 39, 119, 0.3);
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
  .back-link {
    position: static;
    display: inline-flex;
    margin-bottom: 1rem;
  }

  .favorites-title {
    font-size: 1.5rem;
  }

  .favorites-grid {
    grid-template-columns: 1fr;
  }
}
</style>
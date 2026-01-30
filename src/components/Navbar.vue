<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="navbar-brand">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
        <span>诗词中国</span>
      </router-link>

      <div class="navbar-search">
        <div class="search-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索诗词、名句、作者..."
            class="search-input"
            @keyup.enter="handleSearch"
            @focus="showResults = true"
          />
          <button class="search-submit" @click="handleSearch" aria-label="搜索">
            搜索
          </button>
        </div>
        
        <Transition name="fade">
          <div v-if="searchResults.length > 0 && showResults" class="search-results glass-effect">
            <div 
              v-for="result in searchResults.slice(0, 6)" 
              :key="result.poetry.id" 
              class="search-result-item"
              @click="goToResult(result.poetry)"
            >
              <span class="result-title">{{ result.poetry.title }}</span>
              <span class="result-author">{{ result.poetry.author }} · {{ result.poetry.dynasty }}</span>
            </div>
          </div>
        </Transition>
      </div>

      <div class="navbar-nav">
        <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>每日诗词</span>
        </router-link>
        <router-link to="/library" class="nav-link" :class="{ active: $route.path === '/library' }">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <span>诗词大全</span>
        </router-link>
        <router-link to="/authors" class="nav-link" :class="{ active: $route.path === '/authors' }">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>作者名录</span>
        </router-link>
      </div>

      <button class="mobile-menu-btn" @click="toggleMobileMenu" aria-label="菜单">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </div>

    <Transition name="slide-down">
      <div v-if="showMobileMenu" class="mobile-nav glass-effect">
        <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          </svg>
          每日诗词
        </router-link>
        <router-link to="/library" class="mobile-nav-link" @click="closeMobileMenu">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          </svg>
          诗词大全
        </router-link>
        <router-link to="/authors" class="mobile-nav-link" @click="closeMobileMenu">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          </svg>
          作者名录
        </router-link>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { PoetrySearchService } from '../services/searchService';
import type { Poetry } from '../types/poetry';

const router = useRouter();
const poetrySearchService = PoetrySearchService.getInstance();

const searchQuery = ref('');
const showResults = ref(false);
const showMobileMenu = ref(false);

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return [];
  return poetrySearchService.search(searchQuery.value, { limit: 8 });
});

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return;
  
  const results = poetrySearchService.search(searchQuery.value, { limit: 1 });
  
  if (results.length > 0 && results[0]) {
    router.push(`/poetry/${results[0].poetry.id}`);
  } else {
    router.push(`/library?search=${encodeURIComponent(searchQuery.value)}`);
  }
  
  showResults.value = false;
  searchQuery.value = '';
};

const goToResult = (poetry: Poetry) => {
  router.push(`/poetry/${poetry.id}`);
  showResults.value = false;
  searchQuery.value = '';
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const closeMobileMenu = () => {
  showMobileMenu.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  const nav = document.querySelector('.navbar');
  if (nav && !nav.contains(event.target as Node)) {
    showResults.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-sticky);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border-bottom: 1px solid var(--glass-border);
  padding: var(--spacing-md) var(--spacing-lg);
  transition: all var(--transition-base) ease;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-xl);
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  color: var(--primary-color);
  font-size: var(--font-lg);
  font-weight: 700;
  flex-shrink: 0;
  transition: color var(--transition-base) ease;
}

.navbar-brand:hover {
  color: var(--primary-light);
}

.navbar-brand svg {
  color: var(--secondary-color);
  transition: transform var(--transition-base) ease;
}

.navbar-brand:hover svg {
  transform: scale(1.1);
}

.navbar-search {
  flex: 1;
  max-width: 450px;
  position: relative;
}

.search-wrapper {
  display: flex;
  align-items: center;
  background: var(--bg-card);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-full);
  padding: var(--spacing-xs) var(--spacing-md);
  transition: all var(--transition-base) ease;
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

.search-submit {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--font-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base) ease;
  white-space: nowrap;
}

.search-submit:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

.search-submit:active {
  transform: scale(0.95);
}

.search-results {
  position: absolute;
  top: calc(100% + var(--spacing-sm));
  left: 0;
  right: 0;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  max-height: 320px;
  overflow-y: auto;
  border: 1px solid var(--border-secondary);
}

.search-result-item {
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-base) ease;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background: rgba(139, 69, 19, 0.05);
  padding-left: var(--spacing-lg);
}

.result-title {
  font-size: var(--font-base);
  font-weight: 600;
  color: var(--primary-color);
}

.result-author {
  font-size: var(--font-sm);
  color: var(--text-muted);
}

.navbar-nav {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: var(--font-sm);
  font-weight: 500;
  transition: all var(--transition-base) ease;
}

.nav-link:hover {
  color: var(--primary-color);
  background: rgba(139, 69, 19, 0.05);
  transform: translateY(-2px);
}

.nav-link.active {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.nav-link svg {
  flex-shrink: 0;
}

.mobile-menu-btn {
  display: none;
  padding: var(--spacing-sm);
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-base) ease;
}

.mobile-menu-btn:hover {
  color: var(--primary-color);
  transform: scale(1.1);
}

.mobile-nav {
  display: none;
  flex-direction: column;
  padding: var(--spacing-lg);
  gap: var(--spacing-sm);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-secondary);
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: var(--font-base);
  font-weight: 500;
  transition: all var(--transition-base) ease;
}

.mobile-nav-link:hover {
  background: rgba(139, 69, 19, 0.05);
  color: var(--primary-color);
  padding-left: var(--spacing-lg);
}

.mobile-nav-link svg {
  flex-shrink: 0;
  color: var(--text-muted);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-base) ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all var(--transition-base) ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 1024px) {
  .navbar-search {
    max-width: 350px;
  }
  
  .navbar-nav {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .mobile-nav {
    display: flex;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: var(--spacing-sm) var(--spacing-md);
  }
  
  .navbar-brand span {
    font-size: var(--font-base);
  }
  
  .navbar-search {
    max-width: 280px;
  }
  
  .search-submit {
    display: none;
  }
}

@media (max-width: 480px) {
  .navbar-brand svg {
    width: 24px;
    height: 24px;
  }
  
  .navbar-brand span {
    display: none;
  }
  
  .navbar-search {
    max-width: 200px;
  }
  
  .search-input::placeholder {
    font-size: var(--font-sm);
  }
}
</style>

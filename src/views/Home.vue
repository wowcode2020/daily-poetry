<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PoetryCard from '../components/PoetryCard.vue';
import { usePoetry } from '../composables/usePoetry';

const { poetry, loading, error, fetchPoetry } = usePoetry();

const currentDate = ref('');
const showPoetry = ref(false);

const updateDate = () => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  };
  currentDate.value = now.toLocaleDateString('zh-CN', options);
};

onMounted(() => {
  updateDate();
  fetchPoetry();
  
  setTimeout(() => {
    showPoetry.value = true;
  }, 100);
});
</script>

<template>
  <div class="home">
    <div class="home-background"></div>
    
    <div class="container">
      <header class="hero">
        <div class="hero-content animate-slide-up">
          <h1 class="hero-title">每日诗词</h1>
          <p class="hero-date">{{ currentDate }}</p>
          <div class="hero-decoration"></div>
        </div>
      </header>

      <main class="main-content">
        <section class="poetry-section">
          <div v-if="loading" class="loading-container">
            <div class="skeleton skeleton-card"></div>
          </div>

          <div v-else-if="error" class="error-container animate-fade-in">
            <div class="error-icon">⚠️</div>
            <p class="error-message">{{ error }}</p>
            <button class="error-retry" @click="fetchPoetry">重试</button>
          </div>

          <div v-else-if="poetry && showPoetry" class="poetry-container animate-fade-in">
            <PoetryCard :poetry="poetry" @change="fetchPoetry" />
          </div>
        </section>
      </main>

      <footer class="footer">
        <p class="footer-text">每日诗词 · 用心传承中华文化</p>
        <p class="footer-subtext">&copy; {{ new Date().getFullYear() }}</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.home-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    var(--bg-primary) 0%,
    var(--bg-secondary) 50%,
    var(--bg-tertiary) 100%
  );
  z-index: -1;
}

.home-background::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(139, 69, 19, 0.08) 0%,
    transparent 50%
  );
  animation: float 20s ease-in-out infinite;
}

.hero {
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-lg);
  position: relative;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: var(--font-5xl);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
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

.hero-date {
  font-size: var(--font-lg);
  color: var(--text-muted);
  font-weight: 500;
  margin-bottom: var(--spacing-xl);
  opacity: 0.9;
}

.hero-decoration {
  width: 60px;
  height: 3px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--primary-color),
    transparent
  );
  margin: 0 auto;
  border-radius: var(--radius-full);
}

.main-content {
  position: relative;
  z-index: 1;
  padding-top: calc(var(--spacing-3xl) + 60px);
}

.poetry-section {
  max-width: 800px;
  margin: 0 auto var(--spacing-3xl);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-3xl);
}

.skeleton-card {
  width: 100%;
  height: 400px;
  border-radius: var(--radius-xl);
}

.error-container {
  text-align: center;
  padding: var(--spacing-3xl);
  color: #dc2626;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
  opacity: 0.8;
}

.error-message {
  font-size: var(--font-lg);
  margin-bottom: var(--spacing-xl);
  color: var(--text-secondary);
}

.error-retry {
  padding: var(--spacing-md) var(--spacing-xl);
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--secondary-color)
  );
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--font-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base) ease;
  border: none;
}

.error-retry:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.error-retry:active {
  transform: translateY(0);
}

.poetry-container {
  opacity: 0;
  animation: fadeIn var(--transition-slower) ease-out forwards;
}

.footer {
  text-align: center;
  padding: var(--spacing-2xl) var(--spacing-lg);
  border-top: 1px solid var(--border-light);
  position: relative;
  z-index: 1;
}

.footer-text {
  font-size: var(--font-base);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
}

.footer-subtext {
  font-size: var(--font-sm);
  color: var(--text-muted);
  margin: 0;
}

@media (max-width: 768px) {
  .hero {
    padding: var(--spacing-2xl) var(--spacing-md);
  }
  
  .hero-title {
    font-size: var(--font-4xl);
  }
  
  .hero-date {
    font-size: var(--font-base);
  }
  
  .poetry-section {
    margin: 0 auto var(--spacing-2xl);
  }
  
  .error-icon {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: var(--font-3xl);
  }
  
  .hero-date {
    font-size: var(--font-sm);
  }
}
</style>

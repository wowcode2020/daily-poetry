<template>
  <section class="popular-section">
    <h2 class="section-title">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
      热门推荐
    </h2>

    <div class="popular-grid">
      <div
        v-for="(poetry, index) in popularPoetry"
        :key="poetry.id"
        class="popular-card glass-effect"
        :class="`popular-rank-${index + 1}`"
        @click="goToDetail(poetry)"
      >
        <div class="rank-badge">{{ index + 1 }}</div>
        <h3 class="poetry-title">{{ poetry.title }}</h3>
        <p class="poetry-author">{{ poetry.author }} · {{ poetry.dynasty }}</p>
        <p class="poetry-preview">{{ poetry.content[0] }}</p>
        <div class="poetry-tags">
          <span v-for="tag in poetry.tags?.slice(0, 2)" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Poetry } from '../types/poetry';
import backupData from '../data/backupPoetry.json';

const router = useRouter();

defineEmits<{
  select: [poetry: Poetry];
}>();

const popularPoetry = computed(() => {
  const poetry = backupData.poetry.slice();
  const shuffled = poetry.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 6);
});

const goToDetail = (poetry: Poetry) => {
  router.push(`/poetry/${poetry.id}`);
};
</script>

<style scoped>
.popular-section {
  margin-bottom: 4rem;
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.popular-card {
  position: relative;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.popular-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-dark);
}

.rank-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.popular-rank-1 .rank-badge {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  width: 35px;
  height: 35px;
  font-size: 1rem;
}

.popular-rank-2 .rank-badge {
  background: linear-gradient(135deg, #C0C0C0, #A0A0A0);
}

.popular-rank-3 .rank-badge {
  background: linear-gradient(135deg, #CD7F32, #B87333);
}

.poetry-title {
  font-size: 1.2rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  padding-right: 2.5rem;
}

.poetry-author {
  font-size: 0.9rem;
  opacity: 0.7;
  margin-bottom: 0.75rem;
}

.poetry-preview {
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.8;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: 'Noto Serif TC', serif;
}

.poetry-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: rgba(219, 39, 119, 0.1);
  border-radius: 15px;
  font-size: 0.8rem;
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .popular-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 1.25rem;
  }
}
</style>
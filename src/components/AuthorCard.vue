<template>
  <div class="author-card glass-effect" @click="$emit('select', author)">
    <div class="author-avatar">
      {{ author.name.charAt(0) }}
    </div>
    <div class="author-info">
      <h3 class="author-name">{{ author.name }}</h3>
      <span class="author-dynasty">{{ author.dynasty }}</span>
      <p class="author-bio">{{ author.bio }}</p>
      <div class="author-works">
        <span class="works-label">代表作品：</span>
        <span v-for="(work, index) in author.famousWorks" :key="work" class="work-tag">
          {{ work }}{{ index < author.famousWorks.length - 1 ? '、' : '' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Author {
  name: string;
  dynasty: string;
  bio: string;
  famousWorks: string[];
}

interface Props {
  author: Author;
}

defineProps<Props>();
defineEmits<{
  select: [author: Author];
}>();
</script>

<style scoped>
.author-card {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.author-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-dark);
}

.author-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  flex-shrink: 0;
}

.author-info {
  flex: 1;
  min-width: 0;
}

.author-name {
  font-size: 1.2rem;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.author-dynasty {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-radius: 15px;
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
}

.author-bio {
  font-size: 0.9rem;
  line-height: 1.6;
  opacity: 0.8;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.author-works {
  font-size: 0.85rem;
}

.works-label {
  opacity: 0.7;
}

.work-tag {
  color: var(--primary-color);
  margin-right: 0.25rem;
}

@media (max-width: 768px) {
  .author-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .author-info {
    text-align: center;
  }

  .author-works {
    text-align: center;
  }
}
</style>
<template>
  <div class="category-filter">
    <div class="category-tabs">
      <button
        v-for="category in categories"
        :key="category.id"
        class="category-tab"
        :class="{ active: selectedCategory === category.id }"
        @click="selectCategory(category.id)"
      >
        {{ category.name }}
      </button>
    </div>

    <div v-if="selectedCategory && availableTags.length > 0" class="tag-filter">
      <span class="tag-label">标签筛选：</span>
      <div class="tag-list">
        <button
          v-for="tag in availableTags"
          :key="tag.id"
          class="tag-btn"
          :class="{ active: selectedTags.includes(tag.id) }"
          @click="toggleTag(tag.id)"
        >
          {{ tag.icon }} {{ tag.name }}
        </button>
      </div>
    </div>

    <div v-if="selectedCategory || selectedTags.length > 0" class="filter-actions">
      <button class="clear-filter-btn" @click="clearFilters">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        清除筛选
      </button>
      <span class="result-count">找到 {{ filteredResults.length }} 首诗词</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Poetry } from '../types/poetry';
import backupData from '../data/backupPoetry.json';

const emit = defineEmits<{
  'updateResults': [results: Poetry[]];
}>();

const selectedCategory = ref('');
const selectedTags = ref<string[]>([]);

const categories = computed(() => {
  return [
    { id: '', name: '全部' },
    ...backupData.categories
  ];
});

const availableTags = computed(() => {
  if (!selectedCategory.value) {
    return backupData.tags;
  }

  const tagSet = new Set<string>();
  backupData.poetry.forEach(poetry => {
    if (
      (selectedCategory.value === 'tang' && poetry.dynasty === '唐') ||
      (selectedCategory.value === 'song' && poetry.dynasty === '宋') ||
      (selectedCategory.value === 'five-character' && poetry.category?.includes('五言')) ||
      (selectedCategory.value === 'seven-character' && poetry.category?.includes('七言')) ||
      (selectedCategory.value === 'ci' && poetry.category === '词')
    ) {
      poetry.tags?.forEach(tag => tagSet.add(tag));
    }
  });

  return backupData.tags.filter(tag => tagSet.has(tag.name));
});

const filteredResults = computed(() => {
  let results = backupData.poetry;

  if (selectedCategory.value) {
    results = results.filter(poetry => {
      switch (selectedCategory.value) {
        case 'tang':
          return poetry.dynasty === '唐';
        case 'song':
          return poetry.dynasty === '宋';
        case 'five-character':
          return poetry.category?.includes('五言');
        case 'seven-character':
          return poetry.category?.includes('七言');
        case 'ci':
          return poetry.category === '词';
        default:
          return true;
      }
    });
  }

  if (selectedTags.value.length > 0) {
    results = results.filter(poetry =>
      selectedTags.value.some(tagId => {
        const tag = backupData.tags.find(t => t.id === tagId);
        return tag && poetry.tags?.includes(tag.name);
      })
    );
  }

  return results;
});

const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId;
  selectedTags.value = [];
  emit('updateResults', filteredResults.value);
};

const toggleTag = (tagId: string) => {
  const index = selectedTags.value.indexOf(tagId);
  if (index === -1) {
    selectedTags.value.push(tagId);
  } else {
    selectedTags.value.splice(index, 1);
  }
  emit('updateResults', filteredResults.value);
};

const clearFilters = () => {
  selectedCategory.value = '';
  selectedTags.value = [];
  emit('updateResults', backupData.poetry);
};
</script>

<style scoped>
.category-filter {
  padding: 1.5rem;
  background: var(--card-bg-light);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  margin-bottom: 2rem;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.category-tab {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 25px;
  background: transparent;
  color: var(--text-color);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-tab:hover {
  background: rgba(219, 39, 119, 0.1);
}

.category-tab.active {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

.tag-filter {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color-light);
}

.tag-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color-light);
  border-radius: 20px;
  background: transparent;
  color: var(--text-color);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-btn:hover {
  border-color: var(--primary-color);
}

.tag-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.filter-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color-light);
}

.clear-filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: rgba(219, 39, 119, 0.1);
  color: var(--primary-color);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-filter-btn:hover {
  background: rgba(219, 39, 119, 0.2);
}

.result-count {
  font-size: 0.9rem;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .category-filter {
    padding: 1rem;
  }

  .category-tabs {
    gap: 0.25rem;
  }

  .category-tab {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }

  .tag-filter {
    flex-direction: column;
    align-items: flex-start;
  }

  .tag-list {
    width: 100%;
  }

  .filter-actions {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}
</style>
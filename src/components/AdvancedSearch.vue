<template>
  <div class="advanced-search">
    <div class="search-header">
      <h3>高级搜索</h3>
      <button v-if="hasActiveFilters" @click="clearFilters" class="clear-filters-btn">
        清除筛选
      </button>
    </div>

    <div class="search-input-section">
      <input
        v-model="searchQuery"
        @input="handleSearch"
        type="text"
        placeholder="搜索诗词标题、作者或内容..."
        class="search-input"
      />
      <span v-if="hasActiveFilters" class="filter-count">
        {{ activeFilterCount }} 个筛选条件
      </span>
    </div>

    <div class="filter-section">
      <div class="filter-group">
        <label class="filter-label">朝代</label>
        <select v-model="selectedDynasty" @change="handleSearch" class="filter-select">
          <option value="">全部</option>
          <option v-for="dynasty in dynasties" :key="dynasty" :value="dynasty">
            {{ dynasty }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label class="filter-label">体裁</label>
        <select v-model="selectedCategory" @change="handleSearch" class="filter-select">
          <option value="">全部</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label class="filter-label">标签</label>
        <div class="tags-container">
          <button
            v-for="tag in popularTags"
            :key="tag"
            @click="toggleTag(tag)"
            :class="['tag-btn', { active: selectedTags.includes(tag) }]"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <div class="filter-group">
        <label class="filter-label">作者</label>
        <select v-model="selectedAuthor" @change="handleSearch" class="filter-select">
          <option value="">全部</option>
          <option v-for="author in popularAuthors" :key="author" :value="author">
            {{ author }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { PoetrySearchService } from '../services/searchService';
import authorService from '../services/authorService';

const poetrySearchService = PoetrySearchService.getInstance();

const searchQuery = ref('');
const selectedDynasty = ref('');
const selectedCategory = ref('');
const selectedTags = ref<string[]>([]);
const selectedAuthor = ref('');

const dynasties = ref<string[]>([]);
const categories = ref<string[]>([]);
const popularTags = ref<string[]>([]);
const popularAuthors = ref<string[]>([]);

const emit = defineEmits<{
  search: [results: any[], query: string, filters: any];
}>();

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value.trim() !== '' ||
    selectedDynasty.value !== '' ||
    selectedCategory.value !== '' ||
    selectedTags.value.length > 0 ||
    selectedAuthor.value !== ''
  );
});

const activeFilterCount = computed(() => {
  let count = 0;
  if (searchQuery.value.trim() !== '') count++;
  if (selectedDynasty.value !== '') count++;
  if (selectedCategory.value !== '') count++;
  if (selectedTags.value.length > 0) count++;
  if (selectedAuthor.value !== '') count++;
  return count;
});

const loadFilterOptions = async () => {
  try {
    const [tags, authors, categoriesData] = await Promise.all([
      poetrySearchService.getPopularTags(20),
      poetrySearchService.getPopularAuthors(20),
      poetrySearchService.getPopularCategories(10)
    ]);

    popularTags.value = tags.map(t => t.tag);
    popularAuthors.value = authors.map(a => a.author);
    categories.value = categoriesData.map(c => c.category);

    const allAuthors = await poetrySearchService.getPopularAuthors(100);
    const uniqueDynasties = new Set<string>();
    
    for (const item of allAuthors) {
      const authorInfo = authorService.getAuthorByName(item.author);
      if (authorInfo) {
        uniqueDynasties.add(authorInfo.dynasty);
      }
    }
    
    dynasties.value = Array.from(uniqueDynasties).sort();
  } catch (error) {
    console.error('加载筛选选项失败:', error);
  }
};

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag);
  }
  handleSearch();
};

const handleSearch = async () => {
  const filters = {
    dynasty: selectedDynasty.value || undefined,
    category: selectedCategory.value || undefined,
    tags: selectedTags.value.length > 0 ? selectedTags.value : undefined,
    author: selectedAuthor.value || undefined
  };

  const results = await poetrySearchService.search(searchQuery.value, filters);
  emit('search', results, searchQuery.value, filters);
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedDynasty.value = '';
  selectedCategory.value = '';
  selectedTags.value = [];
  selectedAuthor.value = '';
  handleSearch();
};

onMounted(() => {
  loadFilterOptions();
});
</script>

<style scoped>
.advanced-search {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.clear-filters-btn {
  background: #f5f5f5;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.3s;
}

.clear-filters-btn:hover {
  background: #e0e0e0;
  color: #333;
}

.search-input-section {
  position: relative;
  margin-bottom: 24px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #4a90e2;
}

.filter-count {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: #4a90e2;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.filter-select {
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:hover {
  border-color: #4a90e2;
}

.filter-select:focus {
  outline: none;
  border-color: #4a90e2;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-btn {
  padding: 6px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  background: white;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.tag-btn:hover {
  border-color: #4a90e2;
  color: #4a90e2;
}

.tag-btn.active {
  background: #4a90e2;
  color: white;
  border-color: #4a90e2;
}
</style>

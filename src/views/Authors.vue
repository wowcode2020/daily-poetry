<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import poetryDatabase from '../data/poetryDatabase.json';
import authorService from '../services/authorService';
import type { Author } from '../types/poetry';

const router = useRouter();
const selectedDynasty = ref('');
const authorsList = ref<(Author & { poetryCount: number; famousLines: string[] })[]>([]);

onMounted(() => {
  const allAuthors = authorService.getAllAuthors();
  const authorMap = new Map<string, Author & { poetryCount: number; famousLines: string[] }>();
  
  poetryDatabase.poetry.forEach(poetry => {
    const authorInfo = allAuthors.find(a => a.name === poetry.author);
    
    if (!authorMap.has(poetry.author)) {
      authorMap.set(poetry.author, {
        id: authorInfo?.id || poetry.author,
        name: poetry.author,
        dynasty: poetry.dynasty,
        bio: authorInfo?.bio || getAuthorBio(poetry.author),
        famousWorks: authorInfo?.famousWorks || [],
        workCount: authorInfo?.workCount || 0,
        tags: authorInfo?.tags || [],
        poetryCount: 0,
        famousLines: []
      });
    }
    const author = authorMap.get(poetry.author)!;
    author.poetryCount++;
    
    if (poetry.content && poetry.content.length > 0) {
      const firstLine = poetry.content[0]?.replace(/[，。？！]/g, '').trim() || '';
      if (firstLine.length <= 20) {
        author.famousLines.push(firstLine);
      }
    }
  });
  
  authorsList.value = Array.from(authorMap.values());
});

function getAuthorBio(name: string): string {
  const bios: Record<string, string> = {
    '李白': '字太白，号青莲居士，唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。其诗风格豪放飘逸，想象丰富，语言流转自然。',
    '杜甫': '字子美，自号少陵野老，唐代伟大的现实主义诗人，被后人誉为"诗圣"。其诗深刻反映社会现实，笔法严谨。',
    '王维': '字摩诘，号摩诘居士，唐代诗人、画家，有"诗佛"之称。诗画双绝，风格清新淡远。',
    '白居易': '字乐天，号香山居士，唐代伟大的现实主义诗人。其诗通俗易懂，关注民生。',
    '苏轼': '字子瞻，号东坡居士，北宋文学家、书法家、画家，词开豪放一派，诗、词、文皆精。',
    '李清照': '号易安居士，宋代女词人，婉约词派代表，有"千古第一才女"之称。词风清丽婉约。',
    '孟浩然': '唐代著名山水田园诗人，与王维齐名，并称"王孟"。诗清淡自然，多写山水隐逸。',
    '王之涣': '唐代著名诗人，以边塞诗著称。其诗意境开阔，音韵雄浑。',
    '柳宗元': '唐代文学家、哲学家，"唐宋八大家"之一。诗风清峭幽深。',
    '孟郊': '唐代诗人，以苦吟著称，诗多写世态炎凉。',
    '骆宾王': '唐代诗人，"初唐四杰"之一。诗气势充沛，意境深远。',
    '贾岛': '唐代诗人，以苦吟著称，"推敲"典故源于其诗。',
    '张继': '唐代诗人，以《枫桥夜泊》闻名于世。',
    '王勃': '唐代诗人，"初唐四杰"之首。',
    '王翰': '唐代诗人，以边塞诗著称。',
    '王昌龄': '唐代边塞诗人，有"七绝圣手"之称。',
    '李煜': '南唐后主，词坛巨匠，词风哀婉动人。',
    '岳飞': '南宋抗金名将，民族英雄，词作慷慨激昂。',
    '杨慎': '明代文学家，"明代三大才子"之一。',
    '张若虚': '唐代诗人，以《春江花月夜》闻名，被誉为"孤篇盖全唐"。'
  };
  
  return bios[name] || '唐代著名诗人，代表作品广为传诵。';
}

const filteredAuthors = computed(() => {
  let list = authorsList.value;
  
  if (selectedDynasty.value) {
    list = list.filter(a => a.dynasty === selectedDynasty.value);
  }
  
  return list;
});

const dynasties = ['全部', '唐', '宋', '南唐', '明'];

const goToAuthor = (authorName: string) => {
  router.push(`/author/${encodeURIComponent(authorName)}`);
};
</script>

<template>
  <div class="authors-page">
    <div class="container">
      <header class="page-header">
        <h1 class="page-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          作者名录
        </h1>
        <p class="page-subtitle">探索历代诗词大家，感受文学魅力</p>
      </header>

      <main class="page-content">
        <div class="filter-section">
          <div class="filter-group">
            <label>按朝代筛选：</label>
            <div class="filter-btns">
              <button
                v-for="dynasty in dynasties"
                :key="dynasty"
                class="filter-btn"
                :class="{ active: (dynasty === '全部' && !selectedDynasty) || selectedDynasty === dynasty }"
                @click="selectedDynasty = dynasty === '全部' ? '' : dynasty"
              >
                {{ dynasty }}
              </button>
            </div>
          </div>
        </div>

        <div class="authors-grid">
          <div
            v-for="author in filteredAuthors"
            :key="author.name"
            class="author-card glass-effect"
            @click="goToAuthor(author.name)"
          >
            <div class="author-avatar">
              <span class="avatar-text">{{ author.name.charAt(0) }}</span>
            </div>
            <div class="author-info">
              <h3 class="author-name">{{ author.name }}</h3>
              <span class="author-dynasty">{{ author.dynasty }}</span>
              <p class="author-bio">{{ author.bio }}</p>
              <div class="author-stats">
                <span class="stat">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  </svg>
                  {{ author.poetryCount }}首诗词
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredAuthors.length === 0" class="no-results">
          <div class="no-results-icon">👤</div>
          <h3>没有找到相关作者</h3>
          <p>试试其他搜索条件</p>
        </div>
      </main>

      <footer class="footer">
        <p>诗词中国 - 作者名录</p>
        <p>传承中华文化，品味诗词之美</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.authors-page {
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

.filter-section {
  margin: 2rem 0;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-group label {
  font-size: 0.95rem;
  color: var(--text-color);
  opacity: 0.8;
}

.filter-btns {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background: var(--card-bg-light);
  border: 1px solid var(--border-color-light);
  border-radius: 20px;
  color: var(--text-color);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.filter-btn.active {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-color: transparent;
}

.authors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.author-card {
  display: flex;
  gap: 1rem;
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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 1.5rem;
  color: white;
  font-weight: 600;
}

.author-info {
  flex: 1;
  min-width: 0;
}

.author-name {
  font-size: 1.2rem;
  color: var(--primary-color);
  margin: 0 0 0.25rem 0;
}

.author-dynasty {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  background: rgba(219, 39, 119, 0.1);
  border-radius: 12px;
  font-size: 0.8rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.author-bio {
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.8;
  margin: 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.author-stats {
  margin-top: 0.5rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  opacity: 0.7;
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-results h3 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.no-results p {
  opacity: 0.7;
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

  .authors-grid {
    grid-template-columns: 1fr;
  }

  .author-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
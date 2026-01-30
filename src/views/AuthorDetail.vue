<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import poetryDatabase from '../data/poetryDatabase.json';
import authorService from '../services/authorService';

const route = useRoute();
const router = useRouter();

const authorName = computed(() => decodeURIComponent(route.params.id as string));

const authorPoetry = computed(() => {
  return poetryDatabase.poetry.filter(p => p.author === authorName.value);
});

const authorInfo = computed(() => {
  const author = authorService.getAuthorByName(authorName.value);
  if (!author) {
    const firstPoetry = authorPoetry.value[0];
    return {
      dynasty: firstPoetry?.dynasty || '未知',
      bio: getAuthorBio(authorName.value),
      style: getAuthorStyle(authorName.value)
    };
  }
  
  return {
    dynasty: author.dynasty,
    bio: author.bio,
    style: author.style || '风格独特',
    birthYear: author.birthYear,
    deathYear: author.deathYear,
    birthPlace: author.birthPlace,
    workCount: author.workCount,
    famousWorks: author.famousWorks || [],
    tags: author.tags || []
  };
});

const otherAuthors = computed(() => {
  const allAuthors = authorService.getAllAuthors();
  return allAuthors
    .filter(author => author.name !== authorName.value)
    .map(author => author.name)
    .slice(0, 4);
});

function getAuthorBio(name: string): string {
  const bios: Record<string, string> = {
    '李白': '字太白，号青莲居士，唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。生于西域碎叶，后随父迁居绵州昌明县（今四川江油）。其诗风格豪放飘逸，想象丰富，语言流转自然，音律和谐多变。代表作有《将进酒》《蜀道难》《梦游天姥吟留别》等。',
    '杜甫': '字子美，自号少陵野老，唐代伟大的现实主义诗人，被后人誉为"诗圣"。生于河南巩县。其诗深刻反映社会现实，笔法严谨，被称为"诗史"。代表作有《春望》《登高》《茅屋为秋风所破歌》等。',
    '王维': '字摩诘，号摩诘居士，唐代诗人、画家，有"诗佛"之称。河东蒲州（今山西运城）人。其诗画双绝，风格清新淡远，多写山水田园。代表作有《山居秋暝》《鹿柴》《送元二使安西》等。',
    '白居易': '字乐天，号香山居士，唐代伟大的现实主义诗人，生于河南新郑。其诗通俗易懂，关注民生，代表作有《长恨歌》《琵琶行》《赋得古原草送别》等。',
    '苏轼': '字子瞻，号东坡居士，北宋文学家、书法家、画家，眉州眉山（今四川眉山）人。词开豪放一派，诗、词、文皆精，是中国文学史上的全能型大家。代表作有《水调歌头》《念奴娇·赤壁怀古》《赤壁赋》等。',
    '李清照': '号易安居士，宋代女词人，济南章丘（今山东济南）人，婉约词派代表，有"千古第一才女"之称。其词清丽婉约，前期多写闺中生活，后期多写亡国之痛。代表作有《声声慢》《如梦令》《一剪梅》等。'
  };
  
  return bios[name] || '该作者信息暂未收录。';
}

function getAuthorStyle(name: string): string {
  const styles: Record<string, string> = {
    '李白': '豪放飘逸、想象丰富、气势磅礴',
    '杜甫': '沉郁顿挫、深刻凝重、关注民生',
    '王维': '清新淡远、诗画交融、意境幽深',
    '白居易': '通俗易懂、平实质朴、雅俗共赏',
    '苏轼': '豪放旷达、清新自然、哲理深刻',
    '李清照': '清丽婉约、细腻动人、前后期风格迥异'
  };
  
  return styles[name] || '风格独特、自成一派';
}

const goToPoetry = (poetryId: string) => {
  router.push(`/poetry/${poetryId}`);
};

const goToAuthor = (name: string) => {
  router.push(`/author/${encodeURIComponent(name)}`);
};

onMounted(() => {
  if (authorPoetry.value.length === 0) {
    router.push('/authors');
  }
});
</script>

<template>
  <div class="author-detail">
    <div class="container">
      <header class="author-header">
        <button class="back-btn" @click="router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          返回
        </button>
      </header>

      <main v-if="authorPoetry.length > 0" class="author-content">
        <section class="author-intro glass-effect">
          <div class="author-avatar">
            <span class="avatar-text">{{ authorName.charAt(0) }}</span>
          </div>
          <div class="author-info">
            <h1 class="author-name">{{ authorName }}</h1>
            <div class="author-meta">
              <span class="author-dynasty">{{ authorInfo.dynasty }}代诗人</span>
              <span v-if="authorInfo.birthYear" class="author-years">
                {{ authorInfo.birthYear }} - {{ authorInfo.deathYear }}
              </span>
              <span v-if="authorInfo.birthPlace" class="author-place">
                {{ authorInfo.birthPlace }}
              </span>
            </div>
            <p class="author-style">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              {{ authorInfo.style }}
            </p>
            <p class="author-bio">{{ authorInfo.bio }}</p>
            <div v-if="authorInfo.tags && authorInfo.tags.length > 0" class="author-tags">
              <span v-for="tag in authorInfo.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </section>

        <section class="author-works">
          <h2 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            </svg>
            代表作品 ({{ authorPoetry.length }}首)
          </h2>
          
          <div class="works-grid">
            <div
              v-for="poetry in authorPoetry"
              :key="poetry.id"
              class="work-card glass-effect"
              @click="goToPoetry(poetry.id)"
            >
              <h3 class="work-title">{{ poetry.title }}</h3>
              <p class="work-content">{{ poetry.content[0] }}</p>
              <div class="work-meta">
                <span class="work-category">{{ poetry.category }}</span>
                <span class="work-tags">
                  <span v-for="tag in poetry.tags?.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section v-if="otherAuthors.length > 0" class="other-authors">
          <h2 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            其他诗人
          </h2>
          
          <div class="other-authors-grid">
            <div
              v-for="name in otherAuthors"
              :key="name"
              class="other-author-card glass-effect"
              @click="goToAuthor(name)"
            >
              <div class="other-avatar">{{ name.charAt(0) }}</div>
              <span class="other-name">{{ name }}</span>
            </div>
          </div>
        </section>
      </main>

      <footer class="footer">
        <p>诗词中国 - 作者详情</p>
        <p>传承中华文化，品味诗词之美</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.author-detail {
  min-height: 100vh;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
}

.author-header {
  padding: 2rem 0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--card-bg-light);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color-light);
  border-radius: 25px;
  color: var(--text-color);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(219, 39, 119, 0.1);
  border-color: var(--primary-color);
}

.author-content {
  padding-bottom: 4rem;
}

.author-intro {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  margin-bottom: 3rem;
}

.author-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 3rem;
  color: white;
  font-weight: 600;
}

.author-info {
  flex: 1;
}

.author-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.author-name {
  font-size: 2rem;
  color: var(--primary-color);
  margin: 0 0 0.5rem 0;
}

.author-dynasty {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.author-years {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: rgba(219, 39, 119, 0.1);
  border-radius: 12px;
  font-size: 0.85rem;
  color: var(--text-color);
}

.author-place {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: rgba(219, 39, 119, 0.1);
  border-radius: 12px;
  font-size: 0.85rem;
  color: var(--text-color);
}

.author-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.author-tags .tag {
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  background: rgba(219, 39, 119, 0.1);
  border-radius: 10px;
  color: var(--text-color);
}

.author-style {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: var(--text-color);
  opacity: 0.8;
  margin-bottom: 1rem;
}

.author-style svg {
  color: var(--accent-color);
}

.author-bio {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-color);
  opacity: 0.9;
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

.author-works {
  margin-bottom: 3rem;
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.work-card {
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.work-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-dark);
}

.work-title {
  font-size: 1.2rem;
  color: var(--primary-color);
  margin: 0 0 0.75rem 0;
}

.work-content {
  font-size: 1rem;
  line-height: 1.6;
  font-family: 'Noto Serif TC', serif;
  color: var(--text-color);
  opacity: 0.8;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.work-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.work-category {
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  background: rgba(219, 39, 119, 0.1);
  border-radius: 12px;
  color: var(--primary-color);
}

.tag {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  background: rgba(219, 39, 119, 0.05);
  border-radius: 10px;
  color: var(--text-color);
  opacity: 0.7;
  margin-left: 0.25rem;
}

.other-authors {
  padding-top: 2rem;
  border-top: 1px solid var(--border-color-light);
}

.other-authors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.other-author-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
}

.other-author-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-dark);
}

.other-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
  font-weight: 600;
}

.other-name {
  font-size: 0.9rem;
  color: var(--text-color);
  text-align: center;
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
  .author-intro {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .author-name {
    font-size: 1.5rem;
  }

  .works-grid {
    grid-template-columns: 1fr;
  }

  .other-authors-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
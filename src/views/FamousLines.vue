<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import SearchBar from '../components/SearchBar.vue';
import type { Poetry } from '../types/poetry';

interface FamousLine {
  id: string;
  content: string;
  poetryTitle: string;
  author: string;
  dynasty: string;
  theme: string;
  poetryId: string;
}

const router = useRouter();
const selectedTheme = ref('');
const searchQuery = ref('');

const famousLines: FamousLine[] = [
  {
    id: '1',
    content: '海内存知己，天涯若比邻',
    poetryTitle: '送杜少府之任蜀州',
    author: '王勃',
    dynasty: '唐',
    theme: '友情',
    poetryId: '29'
  },
  {
    id: '2',
    content: '欲穷千里目，更上一层楼',
    poetryTitle: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐',
    theme: '哲理',
    poetryId: '3'
  },
  {
    id: '3',
    content: '海内存知己，天涯若比邻',
    poetryTitle: '送杜少府之任蜀州',
    author: '王勃',
    dynasty: '唐',
    theme: '送别',
    poetryId: '29'
  },
  {
    id: '4',
    content: '春眠不觉晓，处处闻啼鸟',
    poetryTitle: '春晓',
    author: '孟浩然',
    dynasty: '唐',
    theme: '春天',
    poetryId: '2'
  },
  {
    id: '5',
    content: '床前明月光，疑是地上霜',
    poetryTitle: '静夜思',
    author: '李白',
    dynasty: '唐',
    theme: '思乡',
    poetryId: '1'
  },
  {
    id: '6',
    content: '举头望明月，低头思故乡',
    poetryTitle: '静夜思',
    author: '李白',
    dynasty: '唐',
    theme: '思乡',
    poetryId: '1'
  },
  {
    id: '7',
    content: '飞流直下三千尺，疑是银河落九天',
    poetryTitle: '望庐山瀑布',
    author: '李白',
    dynasty: '唐',
    theme: '山水',
    poetryId: '13'
  },
  {
    id: '8',
    content: '两岸猿声啼不住，轻舟已过万重山',
    poetryTitle: '早发白帝城',
    author: '李白',
    dynasty: '唐',
    theme: '山水',
    poetryId: '14'
  },
  {
    id: '9',
    content: '黄四娘家花满蹊，千朵万朵压枝低',
    poetryTitle: '江畔独步寻花',
    author: '杜甫',
    dynasty: '唐',
    theme: '春天',
    poetryId: '12'
  },
  {
    id: '10',
    content: '两个黄鹂鸣翠柳，一行白鹭上青天',
    poetryTitle: '绝句',
    author: '杜甫',
    dynasty: '唐',
    theme: '春天',
    poetryId: '12'
  },
  {
    id: '11',
    content: '劝君更尽一杯酒，西出阳关无故人',
    poetryTitle: '送元二使安西',
    author: '王维',
    dynasty: '唐',
    theme: '送别',
    poetryId: '21'
  },
  {
    id: '12',
    content: '独在异乡为异客，每逢佳节倍思亲',
    poetryTitle: '九月九日忆山东兄弟',
    author: '王维',
    dynasty: '唐',
    theme: '思乡',
    poetryId: '22'
  },
  {
    id: '13',
    content: '大漠孤烟直，长河落日圆',
    poetryTitle: '使至塞上',
    author: '王维',
    dynasty: '唐',
    theme: '边塞',
    poetryId: '11'
  },
  {
    id: '14',
    content: '空山不见人，但闻人语响',
    poetryTitle: '鹿柴',
    author: '王维',
    dynasty: '唐',
    theme: '山水',
    poetryId: '5'
  },
  {
    id: '15',
    content: '野火烧不尽，春风吹又生',
    poetryTitle: '赋得古原草送别',
    author: '白居易',
    dynasty: '唐',
    theme: '哲理',
    poetryId: '9'
  },
  {
    id: '16',
    content: '日出江花红胜火，春来江水绿如蓝',
    poetryTitle: '忆江南',
    author: '白居易',
    dynasty: '唐',
    theme: '春天',
    poetryId: '25'
  },
  {
    id: '17',
    content: '同是天涯沦落人，相逢何必曾相识',
    poetryTitle: '琵琶行',
    author: '白居易',
    dynasty: '唐',
    theme: '友情',
    poetryId: '15'
  },
  {
    id: '18',
    content: '先天下之忧而忧，后天下之乐而乐',
    poetryTitle: '岳阳楼记',
    author: '范仲淹',
    dynasty: '宋',
    theme: '哲理',
    poetryId: '16'
  },
  {
    id: '19',
    content: '明月几时有？把酒问青天',
    poetryTitle: '水调歌头',
    author: '苏轼',
    dynasty: '宋',
    theme: '月亮',
    poetryId: '16'
  },
  {
    id: '20',
    content: '但愿人长久，千里共婵娟',
    poetryTitle: '水调歌头',
    author: '苏轼',
    dynasty: '宋',
    theme: '祝福',
    poetryId: '16'
  },
  {
    id: '21',
    content: '大江东去，浪淘尽，千古风流人物',
    poetryTitle: '念奴娇·赤壁怀古',
    author: '苏轼',
    dynasty: '宋',
    theme: '历史',
    poetryId: '17'
  },
  {
    id: '22',
    content: '欲把西湖比西子，淡妆浓抹总相宜',
    poetryTitle: '饮湖上初晴后雨',
    author: '苏轼',
    dynasty: '宋',
    theme: '山水',
    poetryId: '24'
  },
  {
    id: '23',
    content: '人生自古谁无死，留取丹心照汗青',
    poetryTitle: '过零丁洋',
    author: '文天祥',
    dynasty: '宋',
    theme: '爱国',
    poetryId: '20'
  },
  {
    id: '24',
    content: '山重水复疑无路，柳暗花明又一村',
    poetryTitle: '游山西村',
    author: '陆游',
    dynasty: '宋',
    theme: '哲理',
    poetryId: '19'
  },
  {
    id: '25',
    content: '零落成泥碾作尘，只有香如故',
    poetryTitle: '卜算子·咏梅',
    author: '陆游',
    dynasty: '宋',
    theme: '励志',
    poetryId: '19'
  },
  {
    id: '26',
    content: '寻寻觅觅，冷冷清清，凄凄惨惨戚戚',
    poetryTitle: '声声慢',
    author: '李清照',
    dynasty: '宋',
    theme: '悲伤',
    poetryId: '19'
  },
  {
    id: '27',
    content: '莫等闲，白了少年头，空悲切',
    poetryTitle: '满江红',
    author: '岳飞',
    dynasty: '宋',
    theme: '励志',
    poetryId: '20'
  },
  {
    id: '28',
    content: '人生代代无穷已，江月年年只相似',
    poetryTitle: '春江花月夜',
    author: '张若虚',
    dynasty: '唐',
    theme: '哲理',
    poetryId: '26'
  },
  {
    id: '29',
    content: '春江潮水连海平，海上明月共潮生',
    poetryTitle: '春江花月夜',
    author: '张若虚',
    dynasty: '唐',
    theme: '月亮',
    poetryId: '26'
  },
  {
    id: '30',
    content: '此时相望不相闻，愿逐月华流照君',
    poetryTitle: '春江花月夜',
    author: '张若虚',
    dynasty: '唐',
    theme: '爱情',
    poetryId: '26'
  }
];

const themes = [
  '全部',
  '友情',
  '哲理',
  '送别',
  '春天',
  '思乡',
  '山水',
  '月亮',
  '爱国',
  '励志',
  '爱情',
  '悲伤',
  '历史',
  '祝福',
  '边塞'
];

const filteredLines = computed(() => {
  let lines = famousLines;
  
  if (selectedTheme.value && selectedTheme.value !== '全部') {
    lines = lines.filter(line => line.theme === selectedTheme.value);
  }
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    lines = lines.filter(line => 
      line.content.toLowerCase().includes(query) ||
      line.poetryTitle.toLowerCase().includes(query) ||
      line.author.toLowerCase().includes(query)
    );
  }
  
  return lines;
});

const goToPoetry = (poetryId: string) => {
  router.push(`/poetry/${poetryId}`);
};

const handleSearchSelect = (poetry: Poetry) => {
  router.push(`/poetry/${poetry.id}`);
};
</script>

<template>
  <div class="famous-lines">
    <div class="container">
      <header class="page-header">
        <h1 class="page-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          名句集锦
        </h1>
        <p class="page-subtitle">品味千古名句，感受诗词魅力</p>
      </header>

      <main class="page-content">
        <SearchBar
          placeholder="搜索名句、诗词、作者..."
          @select="handleSearchSelect"
        />

        <div class="theme-filter">
          <button
            v-for="theme in themes"
            :key="theme"
            class="theme-btn"
            :class="{ active: selectedTheme === theme || (theme === '全部' && !selectedTheme) }"
            @click="selectedTheme = theme === '全部' ? '' : theme"
          >
            {{ theme }}
          </button>
        </div>

        <div class="lines-grid">
          <div
            v-for="line in filteredLines"
            :key="line.id"
            class="line-card glass-effect"
            @click="goToPoetry(line.poetryId)"
          >
            <div class="line-content">
              <p class="line-text">"{{ line.content }}"</p>
            </div>
            <div class="line-meta">
              <span class="line-source">—— {{ line.poetryTitle }}</span>
              <span class="line-author">{{ line.author }} · {{ line.dynasty }}</span>
            </div>
            <span class="line-theme">{{ line.theme }}</span>
          </div>
        </div>

        <div v-if="filteredLines.length === 0" class="no-results">
          <div class="no-results-icon">📝</div>
          <h3>没有找到相关名句</h3>
          <p>试试其他搜索词或主题</p>
        </div>
      </main>

      <footer class="footer">
        <p>诗词中国 - 名句集锦</p>
        <p>传承中华文化，品味诗词之美</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.famous-lines {
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
  color: var(--accent-color);
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.7;
}

.page-content {
  padding-bottom: 4rem;
}

.theme-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 2rem 0;
  justify-content: center;
}

.theme-btn {
  padding: 0.5rem 1rem;
  background: var(--card-bg-light);
  border: 1px solid var(--border-color-light);
  border-radius: 20px;
  color: var(--text-color);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.theme-btn.active {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-color: transparent;
}

.lines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.line-card {
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.line-card::before {
  content: '"';
  position: absolute;
  top: -10px;
  left: 10px;
  font-size: 6rem;
  color: var(--primary-color);
  opacity: 0.05;
  font-family: serif;
}

.line-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-dark);
}

.line-content {
  margin-bottom: 1rem;
}

.line-text {
  font-size: 1.2rem;
  line-height: 1.6;
  color: var(--text-color);
  font-family: 'Noto Serif TC', serif;
  margin: 0;
}

.line-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color-light);
}

.line-source {
  font-size: 0.95rem;
  color: var(--primary-color);
  font-weight: 500;
}

.line-author {
  font-size: 0.85rem;
  opacity: 0.7;
}

.line-theme {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  background: rgba(219, 39, 119, 0.1);
  border-radius: 12px;
  font-size: 0.8rem;
  color: var(--primary-color);
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

  .lines-grid {
    grid-template-columns: 1fr;
  }

  .line-text {
    font-size: 1.1rem;
  }

  .theme-filter {
    gap: 0.5rem;
  }

  .theme-btn {
    padding: 0.4rem 0.75rem;
    font-size: 0.85rem;
  }
}
</style>
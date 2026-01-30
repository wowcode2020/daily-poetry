import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import type { Poetry, HistoryItem } from '../types/poetry';

const API_URL = 'https://v2.jinrishici.com/one.json';

export function usePoetry() {
  const poetry: Ref<Poetry | null> = ref(null);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);
  const history: Ref<HistoryItem[]> = ref([]);

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('poetry-history');
      if (saved) {
        history.value = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  };

  const saveHistory = (poetryData: Poetry) => {
    const historyItem: HistoryItem = {
      ...poetryData,
      viewedAt: new Date().toISOString()
    };

    const existingIndex = history.value.findIndex(
      item => item.id === poetryData.id
    );

    if (existingIndex !== -1) {
      history.value.splice(existingIndex, 1);
    }

    history.value.unshift(historyItem);

    const uniqueHistory = history.value.filter((item, index, self) =>
      index === self.findIndex((t) => (
        t.id === item.id
      ))
    );

    if (uniqueHistory.length > 20) {
      uniqueHistory.length = 20;
    }

    history.value = uniqueHistory;

    try {
      localStorage.setItem('poetry-history', JSON.stringify(history.value));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  };

  const fetchPoetry = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.data && data.data.origin) {
        const poetryData: Poetry = {
          id: Date.now().toString(),
          title: data.data.origin.title || '无题',
          content: data.data.content ? [data.data.content] : data.data.origin.content || [],
          author: data.data.origin.author || '佚名',
          dynasty: data.data.origin.dynasty || '未知',
          tags: data.data.origin.tags || [],
          origin: data.data.origin.title
        };

        poetry.value = poetryData;
        saveHistory(poetryData);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch poetry';
      console.error('Error fetching poetry:', e);
    } finally {
      loading.value = false;
    }
  };

  const retry = () => {
    fetchPoetry();
  };

  onMounted(() => {
    loadHistory();
  });

  return {
    poetry,
    loading,
    error,
    history,
    fetchPoetry,
    retry
  };
}
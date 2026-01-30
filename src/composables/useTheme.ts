import { ref, onMounted, watch } from 'vue';
import type { Ref } from 'vue';

type Theme = 'light' | 'dark';

export function useTheme() {
  const theme: Ref<Theme> = ref('light');

  const loadTheme = () => {
    try {
      const saved = localStorage.getItem('theme') as Theme;
      if (saved === 'dark' || saved === 'light') {
        theme.value = saved;
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme.value = prefersDark ? 'dark' : 'light';
      }
    } catch (e) {
      console.error('Failed to load theme:', e);
    }
  };

  const saveTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem('theme', newTheme);
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  };

  const applyTheme = (newTheme: Theme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  };

  watch(theme, (newTheme) => {
    applyTheme(newTheme);
    saveTheme(newTheme);
  });

  onMounted(() => {
    loadTheme();
    applyTheme(theme.value);
  });

  return {
    theme,
    toggleTheme
  };
}
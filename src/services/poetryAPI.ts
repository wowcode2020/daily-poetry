interface NetworkPoetry {
  id: string;
  title: string;
  content: string[];
  author: string;
  dynasty: string;
  tags?: string[];
  category?: string;
  famousLine?: string;
  source: 'jinrishici' | 'other';
  timestamp: number;
}

class PoetryAPIService {
  private static instance: PoetryAPIService;
  private cache: Map<string, NetworkPoetry> = new Map();
  private cacheTimeout: number = 60 * 60 * 1000;
  private isEnabled: boolean = false;
  private lastRequestTime: number = 0;
  private minRequestInterval: number = 5000;
  private failedAttempts: number = 0;
  private readonly maxFailedAttempts: number = 3;

  private constructor() {}

  static getInstance(): PoetryAPIService {
    if (!PoetryAPIService.instance) {
      PoetryAPIService.instance = new PoetryAPIService();
    }
    return PoetryAPIService.instance;
  }

  enableNetworkSearch(enable: boolean): void {
    this.isEnabled = enable;
    if (enable) {
      this.failedAttempts = 0;
    }
  }

  isEnabledForSearch(): boolean {
    return this.isEnabled && this.failedAttempts < this.maxFailedAttempts;
  }

  private async rateLimitCheck(): Promise<boolean> {
    if (!this.isEnabledForSearch()) return false;
    
    const now = Date.now();
    if (now - this.lastRequestTime < this.minRequestInterval) {
      return false;
    }
    this.lastRequestTime = now;
    return true;
  }

  async searchFromJinrishici(_query: string): Promise<NetworkPoetry[]> {
    if (!this.isEnabledForSearch()) return [];

    const cacheKey = `jr_random`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return [cached];
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(
        'https://v2.jinrishici.com/one.json?token=&source=web',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        this.failedAttempts++;
        return [];
      }

      const data = await response.json() as any;
      
      if (data.status === 'success' && data.data?.origin) {
        this.failedAttempts = 0;
        const poetry: NetworkPoetry = {
          id: `jr_${Date.now()}`,
          title: data.data.origin.title,
          content: data.data.content ? [data.data.content] : data.data.origin.content,
          author: data.data.origin.author,
          dynasty: data.data.origin.dynasty,
          tags: data.data.origin.tags,
          famousLine: data.data.content || data.data.origin.content?.[0],
          source: 'jinrishici',
          timestamp: Date.now()
        };

        this.cache.set(cacheKey, poetry);
        return [poetry];
      }
      
      this.failedAttempts++;
      return [];
    } catch {
      this.failedAttempts++;
      return [];
    }
  }

  async searchFromGushiwen(_query: string): Promise<NetworkPoetry[]> {
    if (!this.isEnabledForSearch()) return [];
    if (!await this.rateLimitCheck()) return [];

    const cacheKey = `gw_random`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return [cached];
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(
        'https://www.gushiwen.cn/api/2021/renwu.php?c=poet&k=随机',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          },
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        this.failedAttempts++;
        return [];
      }

      const data = await response.json() as any;
      
      if (data && data.items && Array.isArray(data.items)) {
        this.failedAttempts = 0;
        const results = data.items.slice(0, 3).map((item: any, index: number) => ({
          id: `gw_${Date.now()}_${index}`,
          title: item.title || '无题',
          content: item.content ? item.content.split('\n') : [],
          author: item.author || '佚名',
          dynasty: item.dynasty || '未知',
          tags: item.tags ? item.tags.split(',') : [],
          famousLine: item.content ? item.content.split('\n')[0] : '',
          source: 'other' as const,
          timestamp: Date.now()
        }));

        if (results.length > 0) {
          this.cache.set(cacheKey, results[0]);
        }
        return results;
      }
      
      this.failedAttempts++;
      return [];
    } catch {
      this.failedAttempts++;
      return [];
    }
  }

  async searchPoetry(_query: string): Promise<NetworkPoetry[]> {
    if (!this.isEnabledForSearch()) return [];

    try {
      const [jinrishiciResults, gushiwenResults] = await Promise.allSettled([
        this.searchFromJinrishici(_query),
        this.searchFromGushiwen(_query)
      ]);

      const results: NetworkPoetry[] = [];

      if (jinrishiciResults.status === 'fulfilled') {
        results.push(...jinrishiciResults.value);
      }

      if (gushiwenResults.status === 'fulfilled') {
        results.push(...gushiwenResults.value);
      }

      return results;
    } catch {
      return [];
    }
  }

  async getRandomPoetry(): Promise<NetworkPoetry | null> {
    if (!this.isEnabledForSearch()) return null;

    const results = await this.searchFromJinrishici('随机');
    return results[0] || null;
  }

  clearCache(): void {
    this.cache.clear();
  }

  setCacheTimeout(minutes: number): void {
    this.cacheTimeout = minutes * 60 * 1000;
  }

  getStatus(): { enabled: boolean; failedAttempts: number; cacheSize: number } {
    return {
      enabled: this.isEnabled,
      failedAttempts: this.failedAttempts,
      cacheSize: this.cache.size
    };
  }
}

export const poetryAPIService = PoetryAPIService.getInstance();
export type { NetworkPoetry };
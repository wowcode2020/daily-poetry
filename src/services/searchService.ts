import poetryDatabase from '../data/poetryDatabase.json';
import type { Poetry } from '../types/poetry';

export interface SearchResult {
  poetry: Poetry;
  score: number;
  matchType: 'exact' | 'partial' | 'fuzzy' | 'network';
  highlight?: string;
  matchedFields?: string[];
}

interface SearchOptions {
  fuzzy?: boolean;
  limit?: number;
  includeNetwork?: boolean;
  minScore?: number;
  dynasty?: string;
  category?: string;
  tags?: string[];
  author?: string;
  sortBy?: 'relevance' | 'date' | 'popularity';
}

interface CacheEntry {
  query: string;
  results: SearchResult[];
  timestamp: number;
}

export class PoetrySearchService {
  private static instance: PoetrySearchService;
  private searchHistory: string[] = [];
  private readonly maxHistorySize = 10;
  private searchCache: Map<string, CacheEntry> = new Map();
  private readonly cacheTimeout = 5 * 60 * 1000; // 5分钟缓存

  private constructor() {
    this.loadSearchHistory();
    this.loadCache();
  }

  static getInstance(): PoetrySearchService {
    if (!PoetrySearchService.instance) {
      PoetrySearchService.instance = new PoetrySearchService();
    }
    return PoetrySearchService.instance;
  }

  private loadSearchHistory(): void {
    try {
      const saved = localStorage.getItem('poetry_search_history');
      if (saved) {
        this.searchHistory = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load search history:', e);
    }
  }

  private saveSearchHistory(): void {
    try {
      localStorage.setItem('poetry_search_history', JSON.stringify(this.searchHistory));
    } catch (e) {
      console.error('Failed to save search history:', e);
    }
  }

  private loadCache(): void {
    try {
      const saved = localStorage.getItem('poetry_search_cache');
      if (saved) {
        const cacheData = JSON.parse(saved);
        const now = Date.now();
        for (const [key, entry] of Object.entries(cacheData)) {
          const cacheEntry = entry as CacheEntry;
          if (now - cacheEntry.timestamp < this.cacheTimeout) {
            this.searchCache.set(key, cacheEntry);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load search cache:', e);
    }
  }

  private saveCache(): void {
    try {
      const cacheObj: Record<string, CacheEntry> = {};
      this.searchCache.forEach((value, key) => {
        cacheObj[key] = value;
      });
      localStorage.setItem('poetry_search_cache', JSON.stringify(cacheObj));
    } catch (e) {
      console.error('Failed to save search cache:', e);
    }
  }

  private clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.searchCache.entries()) {
      if (now - entry.timestamp > this.cacheTimeout) {
        this.searchCache.delete(key);
      }
    }
    this.saveCache();
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    
    if (s1 === s2) return 1;
    if (s1.includes(s2)) return 0.9;
    if (s2.includes(s1)) return 0.9;
    
    const len1 = s1.length;
    const len2 = s2.length;
    
    if (len1 === 0 || len2 === 0) return 0;
    
    let matches = 0;
    const maxLen = Math.max(len1, len2);
    
    for (let i = 0; i < Math.min(len1, len2); i++) {
      if (s1[i] === s2[i]) {
        matches++;
      }
    }
    
    return (matches / maxLen) * 0.8;
  }

  private normalizeQuery(query: string): string {
    return query
      .toLowerCase()
      .trim()
      .replace(/[，。？！、；："''【】（）]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private searchInData(data: typeof poetryDatabase, query: string, options: SearchOptions = {}): SearchResult[] {
    const normalizedQuery = this.normalizeQuery(query);
    const results: SearchResult[] = [];
    const { 
      fuzzy = true, 
      limit = 20, 
      minScore = 0.3,
      dynasty,
      category,
      tags,
      author
    } = options;

    for (const poetry of data.poetry) {
      let maxScore = 0;
      let matchType: SearchResult['matchType'] = 'fuzzy';
      let matchedFields: string[] = [];

      if (dynasty && poetry.dynasty !== dynasty) continue;
      if (category && poetry.category !== category) continue;
      if (author && poetry.author !== author) continue;
      if (tags && tags.length > 0 && !tags.some(tag => poetry.tags?.includes(tag))) continue;

      const titleScore = this.calculateFieldScore(poetry.title, normalizedQuery, fuzzy);
      if (titleScore > 0) {
        maxScore = Math.max(maxScore, titleScore * 1.0);
        matchType = titleScore === 1 ? 'exact' : 'partial';
        matchedFields.push('标题');
      }

      const authorScore = this.calculateFieldScore(poetry.author, normalizedQuery, fuzzy);
      if (authorScore > 0) {
        maxScore = Math.max(maxScore, authorScore * 0.9);
        if (authorScore === 1) matchType = 'exact';
        matchedFields.push('作者');
      }

      for (const content of poetry.content || []) {
        const contentScore = this.calculateFieldScore(content, normalizedQuery, fuzzy);
        if (contentScore > 0) {
          maxScore = Math.max(maxScore, contentScore * 0.7);
          if (contentScore === 1) matchType = 'exact';
          matchedFields.push('内容');
          break;
        }
      }

      if (poetry.tags) {
        for (const tag of poetry.tags) {
          const tagScore = this.calculateFieldScore(tag, normalizedQuery, fuzzy);
          if (tagScore > 0) {
            maxScore = Math.max(maxScore, tagScore * 0.8);
            if (tagScore === 1) matchType = 'exact';
            matchedFields.push(`标签: ${tag}`);
          }
        }
      }

      if (maxScore >= minScore) {
        const highlight = this.generateHighlight(normalizedQuery, poetry);
        
        results.push({
          poetry,
          score: maxScore,
          matchType,
          highlight,
          matchedFields: [...new Set(matchedFields)]
        });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private calculateFieldScore(field: string, query: string, fuzzy: boolean): number {
    if (!field) return 0;
    
    const normalizedField = field.toLowerCase();
    
    if (normalizedField === query) return 1;
    if (normalizedField.includes(query)) return 0.85;
    
    if (fuzzy) {
      return this.calculateSimilarity(query, normalizedField);
    }
    
    return 0;
  }

  private generateHighlight(query: string, poetry: Poetry): string | undefined {
    const highlights: string[] = [];
    
    if (poetry.title.toLowerCase().includes(query)) {
      highlights.push(poetry.title);
    }
    
    if (poetry.author.toLowerCase().includes(query)) {
      highlights.push(poetry.author);
    }
    
    for (const content of poetry.content || []) {
      if (content.toLowerCase().includes(query)) {
        highlights.push(content);
        break;
      }
    }
    
    return highlights.length > 0 ? highlights.join(' | ') : undefined;
  }

  search(query: string, options: SearchOptions = {}): SearchResult[] {
    if (!query.trim()) return [];
    
    const startTime = performance.now();
    this.addToHistory(query);
    
    const cacheKey = this.generateCacheKey(query, options);
    const cached = this.searchCache.get(cacheKey);
    
    if (cached) {
      const endTime = performance.now();
      console.log(`Search cache hit: ${endTime - startTime}ms`);
      return cached.results;
    }

    const results = this.searchInData(poetryDatabase, query, options);
    
    this.searchCache.set(cacheKey, {
      query,
      results,
      timestamp: Date.now()
    });
    
    this.clearExpiredCache();
    this.saveCache();
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`Search completed in ${duration}ms, found ${results.length} results`);
    
    if (duration > 300) {
      console.warn('Search performance warning: took longer than 300ms');
    }
    
    return results;
  }

  private generateCacheKey(query: string, options: SearchOptions): string {
    const parts = [query];
    if (options.dynasty) parts.push(`dynasty:${options.dynasty}`);
    if (options.category) parts.push(`category:${options.category}`);
    if (options.author) parts.push(`author:${options.author}`);
    if (options.tags && options.tags.length > 0) {
      parts.push(`tags:${options.tags.sort().join(',')}`);
    }
    return parts.join('|');
  }

  async searchWithNetwork(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    const localResults = this.search(query, options);
    
    if (!options.includeNetwork) {
      return localResults;
    }

    if (localResults.length >= (options.limit || 20)) {
      return localResults;
    }

    return localResults;
  }

  addToHistory(query: string): void {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return;
    
    this.searchHistory = this.searchHistory.filter(h => h !== normalized);
    this.searchHistory.unshift(normalized);
    
    if (this.searchHistory.length > this.maxHistorySize) {
      this.searchHistory = this.searchHistory.slice(0, this.maxHistorySize);
    }
    
    this.saveSearchHistory();
  }

  getHistory(): string[] {
    return [...this.searchHistory];
  }

  clearHistory(): void {
    this.searchHistory = [];
    this.saveSearchHistory();
  }

  getSuggestions(query: string): string[] {
    if (!query.trim() || query.length < 2) return [];
    
    const normalized = this.normalizeQuery(query);
    const suggestions = new Set<string>();
    
    for (const poetry of poetryDatabase.poetry) {
      if (poetry.title.toLowerCase().includes(normalized)) {
        suggestions.add(poetry.title);
      }
      if (poetry.author.toLowerCase().includes(normalized)) {
        suggestions.add(poetry.author);
      }
    }
    
    return Array.from(suggestions).slice(0, 5);
  }

  getPopularTags(limit: number = 20): Array<{ tag: string; count: number }> {
    const tagCount = new Map<string, number>();
    
    for (const poetry of poetryDatabase.poetry) {
      for (const tag of poetry.tags || []) {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      }
    }
    
    return Array.from(tagCount.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  getPopularAuthors(limit: number = 20): Array<{ author: string; count: number }> {
    const authorCount = new Map<string, number>();
    
    for (const poetry of poetryDatabase.poetry) {
      authorCount.set(poetry.author, (authorCount.get(poetry.author) || 0) + 1);
    }
    
    return Array.from(authorCount.entries())
      .map(([author, count]) => ({ author, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  getPopularCategories(limit: number = 10): Array<{ category: string; count: number }> {
    const categoryCount = new Map<string, number>();
    
    for (const poetry of poetryDatabase.poetry) {
      if (poetry.category) {
        categoryCount.set(poetry.category, (categoryCount.get(poetry.category) || 0) + 1);
      }
    }
    
    return Array.from(categoryCount.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  getSearchStats(): {
    totalPoetry: number;
    totalAuthors: number;
    totalTags: number;
    cacheSize: number;
  } {
    const authors = new Set(poetryDatabase.poetry.map(p => p.author));
    const tags = new Set(poetryDatabase.poetry.flatMap(p => p.tags || []));
    
    return {
      totalPoetry: poetryDatabase.poetry.length,
      totalAuthors: authors.size,
      totalTags: tags.size,
      cacheSize: this.searchCache.size
    };
  }

  clearCache(): void {
    this.searchCache.clear();
    this.saveCache();
  }
}

export const poetrySearchService = PoetrySearchService.getInstance();
export default poetrySearchService;
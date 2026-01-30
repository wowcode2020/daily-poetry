export interface Poetry {
  id: string;
  title: string;
  content: string[];
  author: string;
  dynasty: string;
  tags?: string[];
  origin?: string;
  category?: string;
}

export interface PoetryResponse {
  status: string;
  data: Poetry;
}

export interface HistoryItem extends Poetry {
  viewedAt: string;
}

export interface Author {
  id: string;
  name: string;
  dynasty: string;
  birthYear?: string;
  deathYear?: string;
  birthPlace?: string;
  style?: string;
  bio: string;
  famousWorks: string[];
  workCount: number;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Tag {
  id: string;
  name: string;
  icon: string;
}

export interface PoetryExplanation {
  background: string;
  authorInfo: string;
  keyWords?: Record<string, string>;
  interpretation: string;
  mood?: string;
}

export interface ExplanationsData {
  explanations: Record<string, PoetryExplanation>;
}
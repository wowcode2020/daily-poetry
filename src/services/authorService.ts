import authorDatabase from '../data/authorDatabase.json';
import type { Author } from '../types/poetry';

class AuthorService {
  private static instance: AuthorService;

  private constructor() {}

  static getInstance(): AuthorService {
    if (!AuthorService.instance) {
      AuthorService.instance = new AuthorService();
    }
    return AuthorService.instance;
  }

  getAuthorByName(name: string): Author | undefined {
    return authorDatabase.authors.find(author => author.name === name);
  }

  getAuthorById(id: string): Author | undefined {
    return authorDatabase.authors.find(author => author.id === id);
  }

  getAllAuthors(): Author[] {
    return authorDatabase.authors;
  }

  getAuthorsByDynasty(dynasty: string): Author[] {
    return authorDatabase.authors.filter(author => author.dynasty === dynasty);
  }

  searchAuthors(query: string): Author[] {
    const normalizedQuery = query.toLowerCase();
    return authorDatabase.authors.filter(author => {
      const nameMatch = author.name.toLowerCase().includes(normalizedQuery);
      const styleMatch = author.style?.toLowerCase().includes(normalizedQuery);
      const tagMatch = author.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery));
      return nameMatch || styleMatch || tagMatch;
    });
  }

  getRelatedAuthors(authorName: string, limit: number = 4): Author[] {
    const currentAuthor = this.getAuthorByName(authorName);
    if (!currentAuthor) return [];

    const sameDynasty = this.getAuthorsByDynasty(currentAuthor.dynasty);
    return sameDynasty
      .filter(author => author.name !== authorName)
      .slice(0, limit);
  }

  getAuthorStats(authorName: string): {
    totalWorks: number;
    dynasty: string;
    style: string;
  } | null {
    const author = this.getAuthorByName(authorName);
    if (!author) return null;

    return {
      totalWorks: author.workCount || 0,
      dynasty: author.dynasty,
      style: author.style || '未知'
    };
  }

  getPopularAuthors(limit: number = 10): Author[] {
    return authorDatabase.authors
      .sort((a, b) => (b.workCount || 0) - (a.workCount || 0))
      .slice(0, limit);
  }

  getAuthorsByTag(tag: string): Author[] {
    return authorDatabase.authors.filter(author =>
      author.tags?.includes(tag)
    );
  }

  getAllDynasties(): string[] {
    const dynasties = new Set(authorDatabase.authors.map(author => author.dynasty));
    return Array.from(dynasties);
  }

  getAllStyles(): string[] {
    const styles = new Set(authorDatabase.authors.map(author => author.style).filter(Boolean));
    return Array.from(styles);
  }
}

export const authorService = AuthorService.getInstance();
export default authorService;
import { Service } from '../types';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Article {
  id: string;
  title: string;
  description: string;
  publishDate: string;
  category: string;
  service?: Service;
  tags?: string[];
  relatedArticles?: string[];
}

export interface ArticleCategory {
  id: string;
  name: string;
  description: string;
}

// カテゴリ定義
export const articleCategories: ArticleCategory[] = [
  {
    id: 'services',
    name: '転職サービス評判',
    description: '各転職サービスの詳細な評判と特徴'
  },
  {
    id: 'job-types',
    name: '職種別転職ガイド',
    description: 'エンジニア職種別の転職情報とアドバイス'
  },
  {
    id: 'career-goals',
    name: '転職動機別戦略',
    description: '転職動機に応じた戦略とノウハウ'
  },
  {
    id: 'comparisons',
    name: '比較・ランキング',
    description: '転職サービスの比較とランキング情報'
  },
  {
    id: 'guides',
    name: '転職ハウツー',
    description: '履歴書作成、面接対策などの実践的ガイド'
  },
  {
    id: 'trends',
    name: '業界動向・トレンド',
    description: 'IT業界の転職市場動向と将来予測'
  },
  {
    id: 'regions',
    name: '地域別転職情報',
    description: '地域別のIT転職市場と企業情報'
  }
];

// 全記事を取得する関数
export function getAllArticles(): Article[] {
  const articles: Article[] = [];
  const articlesDir = path.join(process.cwd(), 'public/articles');
  
  // 各カテゴリのディレクトリを走査
  articleCategories.forEach(category => {
    const categoryDir = path.join(articlesDir, category.id);
    
    if (fs.existsSync(categoryDir)) {
      const files = fs.readdirSync(categoryDir).filter(file => file.endsWith('.md'));
      
      files.forEach(file => {
        const filePath = path.join(categoryDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContent);
        
        articles.push({
          id: path.basename(file, '.md'),
          title: data.title || '',
          description: data.description || '',
          publishDate: data.publishDate || '2025-06-23',
          category: category.id,
          tags: data.tags || [],
          relatedArticles: data.relatedArticles || []
        });
      });
    }
  });
  
  return articles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
}


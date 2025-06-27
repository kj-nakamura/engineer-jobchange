import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BASE_URL = 'https://job.tabmac.site';

interface ArticleCategory {
  id: string;
  name: string;
  description: string;
}

interface Article {
  id: string;
  title: string;
  description: string;
  publishDate: string;
  category: string;
  tags: string[];
  relatedArticles: string[];
}

const articleCategories: ArticleCategory[] = [
  {
    id: "services",
    name: "転職サービス評判",
    description: "各転職サービスの詳細な評判と特徴",
  },
  {
    id: "job-types", 
    name: "職種別転職ガイド",
    description: "エンジニア職種別の転職情報とアドバイス",
  },
  {
    id: "career-goals",
    name: "転職動機別戦略", 
    description: "転職動機に応じた戦略とノウハウ",
  },
  {
    id: "comparisons",
    name: "比較・ランキング",
    description: "転職サービスの比較とランキング情報",
  },
  {
    id: "guides",
    name: "転職ハウツー",
    description: "履歴書作成、面接対策などの実践的ガイド",
  },
  {
    id: "trends",
    name: "業界動向・トレンド",
    description: "IT業界の転職市場動向と将来予測",
  },
  {
    id: "regions",
    name: "地域別転職情報",
    description: "地域別のIT転職市場と企業情報",
  },
];

function getAllArticles(): Article[] {
  const articles: Article[] = [];
  const articlesDir = path.join(process.cwd(), "public/articles");

  articleCategories.forEach((category) => {
    const categoryDir = path.join(articlesDir, category.id);

    if (fs.existsSync(categoryDir)) {
      const files = fs.readdirSync(categoryDir).filter((file) => file.endsWith(".md"));

      files.forEach((file) => {
        const filePath = path.join(categoryDir, file);
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContent);

        articles.push({
          id: path.basename(file, ".md"),
          title: data.title || "",
          description: data.description || "",
          publishDate: data.publishDate || "2025-06-23",
          category: category.id,
          tags: data.tags || [],
          relatedArticles: data.relatedArticles || [],
        });
      });
    }
  });

  return articles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/articles`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Dynamic article pages
  const articles = getAllArticles();
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/articles/${article.id}`,
    lastModified: new Date(article.publishDate),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic category pages
  const categoryPages: MetadataRoute.Sitemap = articleCategories.map((category) => ({
    url: `${BASE_URL}/categories/${category.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages, ...categoryPages];
}
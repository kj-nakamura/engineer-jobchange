import { NextApiRequest, NextApiResponse } from 'next';
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const currentDate = new Date().toISOString().split("T")[0];
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "daily" },
      { url: "/articles", priority: "0.9", changefreq: "daily" },
      { url: "/services", priority: "0.9", changefreq: "weekly" }
    ];

    staticPages.forEach((page) => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${BASE_URL}${page.url}</loc>\n`;
      sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${page.priority}</priority>\n`;
      sitemap += `  </url>\n`;
    });

    // Dynamic article pages
    const articles = getAllArticles();
    articles.forEach((article) => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${BASE_URL}/articles/${article.id}</loc>\n`;
      sitemap += `    <lastmod>${article.publishDate}</lastmod>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>0.8</priority>\n`;
      sitemap += `  </url>\n`;
    });

    // Dynamic category pages
    articleCategories.forEach((category) => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${BASE_URL}/categories/${category.id}</loc>\n`;
      sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>0.7</priority>\n`;
      sitemap += `  </url>\n`;
    });

    sitemap += `</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
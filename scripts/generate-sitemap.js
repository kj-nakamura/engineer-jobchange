const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const BASE_URL = "https://job.tabmac.site"; // 本番環境のドメインに置き換えてください

// ArticleCategory と Article の型定義 (TypeScriptからJavaScriptに変換)
const articleCategories = [
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

function getAllArticles() {
  const articles = [];
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

async function generateSitemap() {
  const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static pages
  const staticPages = ["/", "/articles", "/services"];

  staticPages.forEach((page) => {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${BASE_URL}${page}</loc>\n`;
    sitemap += `    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>\n`;
    sitemap += `    <changefreq>daily</changefreq>\n`;
    sitemap += `    <priority>1.0</priority>\n`;
    sitemap += `  </url>\n`;
  });

  // Dynamic article pages
  const articles = getAllArticles();
  articles.forEach((article) => {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${BASE_URL}/articles/${article.category}/${article.id}</loc>\n`;
    sitemap += `    <lastmod>${article.publishDate}</lastmod>\n`;
    sitemap += `    <changefreq>weekly</changefreq>\n`;
    sitemap += `    <priority>0.8</priority>\n`;
    sitemap += `  </url>\n`;
  });

  // Dynamic category pages
  articleCategories.forEach((category) => {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${BASE_URL}/categories/${category.id}</loc>\n`;
    sitemap += `    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>\n`;
    sitemap += `    <changefreq>weekly</changefreq>\n`;
    sitemap += `    <priority>0.7</priority>\n`;
    sitemap += `  </url>\n`;
  });

  sitemap += `</urlset>`;

  fs.writeFileSync(sitemapPath, sitemap, "utf8");
  console.log(`Sitemap generated at ${sitemapPath}`);
}

generateSitemap();

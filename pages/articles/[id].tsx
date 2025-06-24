import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import { Service } from '../../types';
import ArticleLayout from '../../components/ArticleLayout';
import { trackArticleEngagement } from '../../lib/analytics';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { processMarkdownToHTML } from '../../utils/markdown-renderer';

interface ArticlePageProps {
  service: Service;
  title: string;
  description: string;
  publishDate: string;
  content: string;
  articleCategory?: string;
  services: Service[];
  articleId: string;
}

export default function ArticlePage({ service, title, description, publishDate, content, articleCategory, services, articleId }: ArticlePageProps) {
  const pageTitle = `${title} | エンジニア転職ナビ`;
  
  useEffect(() => {
    trackArticleEngagement(articleId, articleCategory || 'general', 'start_reading');
    
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercentage >= 50 && !sessionStorage.getItem(`scroll_50_${articleId}`)) {
        trackArticleEngagement(articleId, articleCategory || 'general', 'scroll_50');
        sessionStorage.setItem(`scroll_50_${articleId}`, 'true');
      }
      
      if (scrollPercentage >= 100 && !sessionStorage.getItem(`scroll_100_${articleId}`)) {
        trackArticleEngagement(articleId, articleCategory || 'general', 'scroll_100');
        sessionStorage.setItem(`scroll_100_${articleId}`, 'true');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [articleId, articleCategory]);
  
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={publishDate} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={`https://engineer-jobchange.vercel.app/articles/${service.id}`} />
      </Head>
      <ArticleLayout
        service={service}
        title={title}
        publishDate={publishDate}
        content={content}
        articleCategory={articleCategory}
        articleId={articleId}
        services={services}
      />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const servicesData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public/data/services.json'), 'utf8')
  );
  
  // 記事データも読み込み
  const articlesData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public/data/articles.json'), 'utf8')
  );

  // サービス記事のパスを追加
  const servicePaths = servicesData.map((service: Service) => ({
    params: { id: service.id },
  }));
  
  // 記事のパスを追加
  const articlePaths = articlesData.map((article: any) => ({
    params: { id: article.id },
  }));

  return {
    paths: [...servicePaths, ...articlePaths],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params!;

  // サービスデータを取得
  const servicesData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public/data/services.json'), 'utf8')
  );

  // 記事データを取得
  const articlesData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public/data/articles.json'), 'utf8')
  );

  // サービスまたは記事データを取得
  let service = servicesData.find((s: Service) => s.id === id);
  const article = articlesData.find((a: any) => a.id === id);

  // 記事データがある場合、サービスデータがなくてもダミーのサービスを作成
  if (article && !service) {
    service = {
      id: article.id,
      name: article.category,
      description: article.description,
      tags: [],
      motiveTags: [],
      jobTypeTags: [],
      url: '#',
      features: [],
      pros: [],
      cons: [],
      suitableFor: [],
      pricing: '',
      registration: ''
    };
  }

  if (!service) {
    return {
      notFound: true,
    };
  }

  // Markdownファイルを読み込み（サービス記事の場合はservicesフォルダから）
  let markdownPath = path.join(process.cwd(), 'public/articles/services', `${id}.md`);
  
  // サービス記事が見つからない場合は、他のカテゴリを確認
  if (!fs.existsSync(markdownPath)) {
    const categories = ['job-types', 'career-goals', 'comparisons', 'guides', 'trends', 'regions'];
    for (const category of categories) {
      const categoryPath = path.join(process.cwd(), 'public/articles', category, `${id}.md`);
      if (fs.existsSync(categoryPath)) {
        markdownPath = categoryPath;
        break;
      }
    }
  }
  
  if (!fs.existsSync(markdownPath)) {
    return {
      notFound: true,
    };
  }

  const markdownContent = fs.readFileSync(markdownPath, 'utf8');
  const { data, content } = matter(markdownContent);

  // 記事カテゴリを推定（記事データがある場合はそのカテゴリ、ない場合は'services'）
  const category = article ? article.category : 'services';

  // カスタムマークダウンレンダラーでHTMLに変換
  const htmlContent = await processMarkdownToHTML(content, {
    services: servicesData,
    articleId: id as string,
    articleCategory: category,
  });

  return {
    props: {
      service,
      title: data.title || service.name,
      description: data.description || service.description,
      publishDate: data.publishDate || '2025-06-23',
      content: htmlContent,
      articleCategory: category,
      services: servicesData,
      articleId: id as string,
    },
  };
};
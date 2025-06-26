import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import { Service } from '../../types';
import ArticleLayout from '../../components/ArticleLayout';
import { trackArticleEngagement } from '../../lib/analytics';
import { getAllArticles, Article } from '../../utils/articles';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
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
  relatedArticles: Article[];
}

export default function ArticlePage({ service, title, description, publishDate, content, articleCategory, services, articleId, relatedArticles }: ArticlePageProps) {
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
        relatedArticles={relatedArticles}
      />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = getAllArticles();
  const paths = articles.map(article => ({
    params: { id: article.id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params!;
  const allArticles = getAllArticles();
  const article = allArticles.find(a => a.id === id as string);

  if (!article) {
    return {
      notFound: true,
    };
  }

  const markdownPath = path.join(process.cwd(), 'public/articles', article.category, `${article.id}.md`);
  if (!fs.existsSync(markdownPath)) {
    return {
      notFound: true,
    };
  }

  const servicesData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public/data/services.json'), 'utf8')
  );

  let service = servicesData.find((s: Service) => s.id === id);
  if (!service) {
    service = {
      id: article.id,
      name: article.title,
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

  const markdownContent = fs.readFileSync(markdownPath, 'utf8');
  const { data, content } = matter(markdownContent);

  const htmlContent = await processMarkdownToHTML(content, {
    services: servicesData,
    articleId: id as string,
    articleCategory: article.category,
  });

  const relatedArticles = (article.relatedArticles || [])
    .map((relatedId: string) => allArticles.find(a => a.id === relatedId))
    .filter((a): a is Article => !!a)
    .slice(0, 4);

  return {
    props: {
      service,
      title: data.title || article.title,
      description: data.description || article.description,
      publishDate: data.publishDate || article.publishDate,
      content: htmlContent,
      articleCategory: article.category,
      services: servicesData,
      articleId: id as string,
      relatedArticles,
    },
  };
};

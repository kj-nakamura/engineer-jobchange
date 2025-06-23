import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { Service } from '../../types';
import ArticleLayout from '../../components/ArticleLayout';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

interface ArticlePageProps {
  service: Service;
  title: string;
  description: string;
  publishDate: string;
  content: string;
}

export default function ArticlePage({ service, title, description, publishDate, content }: ArticlePageProps) {
  const pageTitle = `${title} | エンジニア転職ナビ`;
  
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
      />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const servicesData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public/data/services.json'), 'utf8')
  );

  const paths = servicesData.map((service: Service) => ({
    params: { id: service.id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params!;

  // サービスデータを取得
  const servicesData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public/data/services.json'), 'utf8')
  );

  const service = servicesData.find((s: Service) => s.id === id);

  if (!service) {
    return {
      notFound: true,
    };
  }

  // Markdownファイルを読み込み
  const markdownPath = path.join(process.cwd(), 'public/articles', `${id}.md`);
  
  if (!fs.existsSync(markdownPath)) {
    return {
      notFound: true,
    };
  }

  const markdownContent = fs.readFileSync(markdownPath, 'utf8');
  const { data, content } = matter(markdownContent);

  // MarkdownをHTMLに変換
  const htmlContent = await marked(content);

  return {
    props: {
      service,
      title: data.title || service.name,
      description: data.description || service.description,
      publishDate: data.publishDate || '2025-06-23',
      content: htmlContent,
    },
  };
};
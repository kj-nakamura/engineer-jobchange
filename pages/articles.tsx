import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Article, articleCategories } from '../utils/articles-client';
import CategoryArticleList from '../components/CategoryArticleList';
import { generateArticles } from '../utils/articles-client';

export default function ArticlesPage() {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const articlesRes = await fetch('/data/articles.json');
        if (articlesRes.ok) {
          const allArticlesData = await articlesRes.json();
          setAllArticles(allArticlesData);
        } else {
          // fallback for when articles.json is not generated
          const servicesRes = await fetch('/data/services.json');
          const servicesData = await servicesRes.json();
          const generatedArticles = generateArticles(servicesData);
          setAllArticles(generatedArticles);
        }
      } catch (error) {
        console.error('記事データの読み込みに失敗:', error);
        setAllArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">記事を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>記事一覧 | エンジニア転職ナビ</title>
        <meta name="description" content="エンジニアの転職に役立つ記事一覧。キャリアプラン、転職サービス比較、各種ガイド、職種解説、技術トレンドなど、幅広い情報を提供します。" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            記事一覧
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            エンジニアの転職活動に役立つ情報をカテゴリ別にご紹介します。
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <CategoryArticleList 
            categories={articleCategories} 
            articles={allArticles} 
          />
        </div>
      </div>
    </>
  );
}

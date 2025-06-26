import { GetStaticProps } from 'next';
import Head from 'next/head';
import { Article, articleCategories, getAllArticles } from '../utils/articles';
import CategoryArticleList from '../components/CategoryArticleList';

interface ArticlesPageProps {
  allArticles: Article[];
}

export default function ArticlesPage({ allArticles }: ArticlesPageProps) {
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

export const getStaticProps: GetStaticProps = async () => {
  const allArticles = getAllArticles();
  return {
    props: {
      allArticles,
    },
  };
};

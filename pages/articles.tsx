import { GetStaticProps } from 'next';
import Head from 'next/head';
import { Article, getAllArticles } from '../utils/articles';
import AllArticlesList from '../components/AllArticlesList';

interface ArticlesPageProps {
  allArticles: Article[];
}

export default function ArticlesPage({ allArticles }: ArticlesPageProps) {
  return (
    <>
      <Head>
        <title>全記事一覧 | エンジニア転職ナビ</title>
        <meta name="description" content="エンジニア転職ナビの全記事一覧。職種別転職ガイド、キャリア戦略、転職サービス評判、技術トレンドなど86記事を検索・カテゴリ別フィルターで効率的に探せます。" />
        <meta property="og:title" content="全記事一覧 | エンジニア転職ナビ" />
        <meta property="og:description" content="エンジニア転職ナビの全記事一覧。職種別転職ガイド、キャリア戦略、転職サービス評判、技術トレンドなど86記事を検索・カテゴリ別フィルターで効率的に探せます。" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="全記事一覧 | エンジニア転職ナビ" />
        <meta name="twitter:description" content="エンジニア転職ナビの全記事一覧。職種別転職ガイド、キャリア戦略、転職サービス評判、技術トレンドなど86記事を検索・カテゴリ別フィルターで効率的に探せます。" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            全記事一覧
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            エンジニアの転職活動に役立つ情報を全{allArticles.length}記事掲載。<br className="sm:hidden"/>
            検索・フィルター機能でお探しの記事を効率的に見つけられます。
          </p>
        </div>

        <AllArticlesList articles={allArticles} />
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

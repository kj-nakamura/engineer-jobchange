import { useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Article, ArticleCategory, articleCategories, getAllArticles } from '../../utils/articles';

interface CategoryPageProps {
  category: ArticleCategory;
  articles: Article[];
  totalCount: number;
}

export default function CategoryPage({ category, articles, totalCount }: CategoryPageProps) {
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 12;

  // ソート処理
  const sortedArticles = [...articles].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  // ページネーション
  const totalPages = Math.ceil(sortedArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = sortedArticles.slice(startIndex, startIndex + articlesPerPage);

  const pageTitle = `${category.name} | エンジニア転職ナビ`;
  const pageDescription = `${category.description}。エンジニア転職に役立つ${totalCount}件の記事をご紹介します。`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={`https://engineer-jobchange.vercel.app/categories/${category.id}`} />
      </Head>

      <div className="container mx-auto px-4 py-8">
          {/* パンくずナビゲーション */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  ホーム
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li>
                <span className="text-gray-900 font-medium">{category.name}</span>
              </li>
            </ol>
          </nav>

          {/* ヘッダー部分 */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <CategoryIcon categoryId={category.id} />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              {category.name}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              {category.description}
            </p>
            <div className="inline-flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {totalCount}件の記事
            </div>
          </header>

          {/* コントロール部分 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">並び替え:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="date">公開日順</option>
                  <option value="title">タイトル順</option>
                </select>
              </div>

              {/* ページ情報 */}
              {totalPages > 1 && (
                <div className="text-sm text-gray-600">
                  {startIndex + 1}-{Math.min(startIndex + articlesPerPage, sortedArticles.length)} / {sortedArticles.length}件
                </div>
              )}
            </div>
          </div>

          {/* 記事一覧 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {currentArticles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  {/* タグ表示 */}
                  <div className="flex items-center mb-3">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {category.name}
                    </span>
                    {article.tags && article.tags.length > 0 && (
                      <span className="ml-2 text-xs text-gray-500">
                        #{article.tags[0]}
                      </span>
                    )}
                  </div>

                  {/* 記事タイトル */}
                  <h2 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-200 line-clamp-2">
                    {article.title}
                  </h2>

                  {/* 記事説明 */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {article.description}
                  </p>

                  {/* 公開日とCTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(article.publishDate).toLocaleDateString('ja-JP')}
                    </span>
                    <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                      読む
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* ホバー時のボーダー効果 */}
                <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
            ))}
          </div>

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                前へ
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                次へ
              </button>
            </div>
          )}

          {/* 記事がない場合 */}
          {sortedArticles.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">記事が見つかりません</h3>
              <p className="text-gray-600 mb-6">このカテゴリにはまだ記事がありません。</p>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ホームに戻る
              </Link>
            </div>
          )}
        </div>
    </>
  );
}

// カテゴリアイコンコンポーネント
function CategoryIcon({ categoryId }: { categoryId: string }) {
  const iconProps = {
    className: "w-8 h-8 text-white",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  };

  const icons = {
    services: (
      <svg {...iconProps}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    'job-types': (
      <svg {...iconProps}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
      </svg>
    ),
    'career-goals': (
      <svg {...iconProps}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    comparisons: (
      <svg {...iconProps}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    guides: (
      <svg {...iconProps}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    trends: (
      <svg {...iconProps}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    regions: (
      <svg {...iconProps}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  };

  return icons[categoryId as keyof typeof icons] || icons.services;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = articleCategories.map((category) => ({
    params: { category: category.id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { category: categoryId } = params!;
  const category = articleCategories.find(cat => cat.id === categoryId);

  if (!category) {
    return {
      notFound: true,
    };
  }

  const allArticles = getAllArticles();
  const articles = allArticles.filter(article => article.category === categoryId);

  return {
    props: {
      category,
      articles,
      totalCount: articles.length,
    },
  };
};
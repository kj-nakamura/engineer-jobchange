import Link from 'next/link';
import { Article, ArticleCategory } from '../utils/articles';

interface CategoryArticleListProps {
  categories: ArticleCategory[];
  articles: Article[];
}

export default function CategoryArticleList({ categories, articles }: CategoryArticleListProps) {
  // カテゴリごとに記事をグループ化
  const articlesByCategory = articles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {} as Record<string, Article[]>);

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          転職に役立つ記事一覧
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          職種別ガイド、年収アップ戦略、面接対策など、エンジニア転職を成功に導く情報が満載
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {categories.map((category) => {
          const categoryArticles = articlesByCategory[category.id] || [];
          if (categoryArticles.length === 0) return null;

          return (
            <div key={category.id} className="mb-12">
              {/* カテゴリヘッダー */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                    <CategoryIcon categoryId={category.id} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* 記事グリッド */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryArticles.slice(0, 6).map((article) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.id}`}
                    className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] overflow-hidden border border-gray-100"
                  >
                    <div className="p-6">
                      {/* カテゴリバッジ */}
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

                      {/* 記事タイトル・説明統合ブロック */}
                      <div className="mb-4">
                        <h4 className="text-base font-semibold text-gray-800 mb-1.5 group-hover:text-blue-700 transition-colors duration-200 line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed">
                          {article.description}
                        </p>
                      </div>

                      {/* 公開日とCTA */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {article.publishDate}
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

              {/* もっと見るリンク */}
              {categoryArticles.length > 6 && (
                <div className="text-center mt-8">
                  <Link
                    href={`/categories/${category.id}`}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-50 to-gray-50 hover:from-blue-50 hover:to-indigo-50 text-gray-700 hover:text-blue-700 font-semibold rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md hover:shadow-gray-200/50 hover:-translate-y-0.5 group"
                  >
                    <svg className="w-4 h-4 mr-2 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {category.name}の記事をもっと見る
                    <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// カテゴリアイコンコンポーネント
function CategoryIcon({ categoryId }: { categoryId: string }) {
  const iconProps = {
    className: "w-5 h-5 text-white",
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
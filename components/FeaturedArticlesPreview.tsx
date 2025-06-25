import Link from 'next/link';
import { Article } from '../utils/articles-client';

interface FeaturedArticlesPreviewProps {
  articles: Article[];
  onViewAllArticles: () => void;
}

export default function FeaturedArticlesPreview({ articles, onViewAllArticles }: FeaturedArticlesPreviewProps) {
  // 注目記事を選定（最初の3件を表示）
  const featuredArticles = articles.slice(0, 3);

  if (featuredArticles.length === 0) {
    return null;
  }

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            注目の記事
          </h2>
          <p className="text-gray-600">
            転職成功に役立つ最新情報をチェック
          </p>
        </div>
        <button
          onClick={onViewAllArticles}
          className="hidden sm:flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          記事一覧を見る
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredArticles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.id}`}
            className="group bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] overflow-hidden border border-gray-100"
          >
            <div className="p-6">
              {/* カテゴリバッジ */}
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {article.service?.name || getCategoyName(article.category)}
                </span>
              </div>

              {/* 記事タイトル・説明統合ブロック */}
              <div className="mb-4">
                <h3 className="text-base font-bold text-gray-800 mb-1.5 group-hover:text-blue-700 transition-colors duration-200 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed">
                  {article.description}
                </p>
              </div>

              {/* 公開日とCTA */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {article.publishDate}
                </span>
                <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                  詳しく読む
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

      {/* モバイル用の「記事一覧を見る」ボタン */}
      <div className="sm:hidden text-center mt-6">
        <button
          onClick={onViewAllArticles}
          className="inline-flex items-center px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg transition-all duration-300"
        >
          記事一覧を見る
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}

// カテゴリ名の変換関数
function getCategoyName(category: string): string {
  const categoryNames: Record<string, string> = {
    'services': 'サービス',
    'job-types': '職種ガイド',
    'career-goals': 'キャリア戦略',
    'comparisons': '比較',
    'guides': 'ガイド',
    'trends': 'トレンド',
    'regions': '地域'
  };
  return categoryNames[category] || category;
}
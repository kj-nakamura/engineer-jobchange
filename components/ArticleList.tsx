import Link from 'next/link';
import { Article } from '../utils/articles-client';

interface ArticleListProps {
  articles: Article[];
}

export default function ArticleList({ articles }: ArticleListProps) {
  return (
    <section id="articles" className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          転職サービス詳細記事
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          各転職サービスの評判、特徴、メリット・デメリットを詳しく解説
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.id}`}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden border border-gray-100"
          >
            <div className="p-6">
              {/* サービス名バッジ */}
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {article.service?.name || article.category}
                </span>
              </div>

              {/* 記事タイトル */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-200 line-clamp-2">
                {article.title}
              </h3>

              {/* 記事説明 */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                {article.description}
              </p>

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
    </section>
  );
}
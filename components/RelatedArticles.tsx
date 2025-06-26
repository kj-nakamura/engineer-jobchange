import Link from 'next/link';
import { Article } from '../utils/articles';

interface RelatedArticlesProps {
  relatedArticles: Article[];
}

export default function RelatedArticles({ relatedArticles }: RelatedArticlesProps) {
  if (!relatedArticles || relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200 p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900">関連記事</h3>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relatedArticles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.id}`}
            className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
          >
            <div className="flex items-start">
              {/* Category Icon */}
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <CategoryIcon categoryId={article.category} />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Category Badge */}
                <div className="mb-2">
                  <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    {getCategoryName(article.category)}
                  </span>
                </div>
                
                {/* Title */}
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200 line-clamp-2 leading-relaxed mb-2">
                  {article.title}
                </h4>
                
                {/* Description */}
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
                  {article.description}
                </p>
                
                {/* Read More */}
                <div className="flex items-center text-blue-600 text-xs font-medium group-hover:text-blue-700">
                  詳しく読む
                  <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// カテゴリアイコンコンポーネント
function CategoryIcon({ categoryId }: { categoryId: string }) {
  const iconProps = {
    className: "w-5 h-5 text-blue-600",
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

// カテゴリ名の変換関数
function getCategoryName(category: string): string {
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
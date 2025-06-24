import { Service } from '../types';
import { useState } from 'react';
import Link from 'next/link';
import { Article } from '../utils/articles-client';

interface ArticleLayoutProps {
  service: Service;
  title: string;
  publishDate: string;
  content: string;
  articleCategory?: string;
}

export default function ArticleLayout({ service, title, publishDate, content, articleCategory }: ArticleLayoutProps) {
  const [imageError, setImageError] = useState(false);
  const [defaultImageError, setDefaultImageError] = useState(false);

  // カテゴリに基づいてデフォルト画像URLを取得
  const getDefaultImageUrl = (category?: string) => {
    if (!category) return '/images/defaults/general.svg';
    return `/images/defaults/${category}.svg`;
  };

  const defaultImageUrl = getDefaultImageUrl(articleCategory);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-4"></div>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                {service.description}
              </p>
              <div className="text-sm text-gray-500">
                公開日: {publishDate}
              </div>
            </div>
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center ml-6">
              {!imageError && service.imageUrl ? (
                <img 
                  src={service.imageUrl} 
                  alt={`${service.name} logo`}
                  className="w-12 h-12 object-contain"
                  onError={() => setImageError(true)}
                />
              ) : !defaultImageError ? (
                <img 
                  src={defaultImageUrl}
                  alt={`${articleCategory || 'general'} category icon`}
                  className="w-12 h-12 object-contain"
                  onError={() => setDefaultImageError(true)}
                />
              ) : (
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div 
            className="prose prose-lg max-w-none 
              prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-3xl prose-h1:mb-8 prose-h1:mt-0 prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-4
              prose-h2:text-2xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:text-gray-800 prose-h2:border-l-4 prose-h2:border-gray-500 prose-h2:pl-4 prose-h2:bg-gray-50 prose-h2:py-3 prose-h2:rounded-r-lg
              prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-slate-700 prose-h3:font-bold prose-h3:border-b-2 prose-h3:border-slate-300 prose-h3:pb-2
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline prose-a:transition-all prose-a:duration-200 prose-a:border-b prose-a:border-blue-200 hover:prose-a:text-blue-800 hover:prose-a:border-blue-400 hover:prose-a:bg-blue-50 hover:prose-a:px-1 hover:prose-a:rounded
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-ul:mb-6 prose-ul:space-y-2 prose-li:mb-0 prose-li:text-gray-700 prose-li:relative prose-li:pl-2 marker:prose-li:text-blue-500 marker:prose-li:text-lg
              prose-ol:mb-6 prose-ol:space-y-2
              prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/official relative inline-flex items-center justify-center bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover/official:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 -translate-x-full group-hover/official:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            
            <span className="relative z-10 flex items-center">
              <svg className="w-5 h-5 mr-3 group-hover/official:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
              </svg>
              {service.name}の公式サイトへ
              <svg className="w-4 h-4 ml-3 group-hover/official:translate-x-1 group-hover/official:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </span>
          </a>

          <Link
            href="/"
            className="group/home relative inline-flex items-center justify-center bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-gray-500/25 hover:shadow-xl hover:shadow-gray-500/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover/home:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 -translate-x-full group-hover/home:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            
            <span className="relative z-10 flex items-center">
              <svg className="w-5 h-5 mr-3 group-hover/home:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              ホームに戻る
            </span>
          </Link>
        </div>
      </div>
  );
}
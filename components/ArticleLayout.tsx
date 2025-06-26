import { Service } from '../types';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Article } from '../utils/articles-client';
import { trackAffiliateClick, trackArticleEngagement } from '../lib/analytics';
import { extractComponentData } from '../utils/markdown-renderer';
import AffiliateButton from './AffiliateButton';
import ServiceCTA from './ServiceCTA';
import TableOfContents from './TableOfContents';
import RelatedArticles from './RelatedArticles';
import { createRoot } from 'react-dom/client';

interface ArticleLayoutProps {
  service: Service;
  title: string;
  publishDate: string;
  content: string;
  articleCategory?: string;
  articleId?: string;
  services?: Service[];
  relatedArticles?: Article[];
}

export default function ArticleLayout({ service, title, publishDate, content, articleCategory, articleId, services = [], relatedArticles = [] }: ArticleLayoutProps) {
  const [imageError, setImageError] = useState(false);
  const [defaultImageError, setDefaultImageError] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Render custom components in article content and add IDs to headings
  useEffect(() => {
    if (contentRef.current && content) {
      // Add IDs to heading elements for table of contents navigation
      const headers = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headers.forEach((header, index) => {
        if (!header.id) {
          header.id = `heading-${index}`;
        }
      });

      // Render custom components
      const components = extractComponentData(content);
      
      components.forEach(({ type, elementId, props }) => {
        const element = document.getElementById(elementId);
        if (element) {
          const root = createRoot(element);
          
          if (type === 'affiliate-button') {
            root.render(
              <AffiliateButton
                {...props}
                trackingId={props.trackingId || service.id}
              />
            );
          } else if (type === 'service-cta') {
            root.render(
              <ServiceCTA
                {...props}
              />
            );
          }
        }
      });
    }
  }, [content, service.id]);

  // Article engagement tracking
  useEffect(() => {
    if (articleId && articleCategory) {
      // Track article start reading
      trackArticleEngagement(articleId, articleCategory, 'start_reading');

      // Track scroll depth
      let scroll50Tracked = false;
      let scroll100Tracked = false;

      const handleScroll = () => {
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        if (scrollPercentage >= 50 && !scroll50Tracked) {
          trackArticleEngagement(articleId, articleCategory, 'scroll_50');
          scroll50Tracked = true;
        }
        
        if (scrollPercentage >= 90 && !scroll100Tracked) {
          trackArticleEngagement(articleId, articleCategory, 'scroll_100');
          scroll100Tracked = true;
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [articleId, articleCategory]);

  // カテゴリに基づいてデフォルト画像URLを取得
  const getDefaultImageUrl = (category?: string) => {
    if (!category) return '/images/defaults/general.svg';
    return `/images/defaults/${category}.svg`;
  };

  const defaultImageUrl = getDefaultImageUrl(articleCategory);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Article Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              {/* Article Header */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                      {title}
                    </h1>
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
              <div 
                ref={contentRef}
                className="prose prose-lg max-w-none 
                  prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
                  prose-h2:text-2xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:text-gray-800 prose-h2:border-l-4 prose-h2:border-gray-500 prose-h2:pl-4 prose-h2:bg-gray-50 prose-h2:py-3 prose-h2:rounded-r-lg
                  prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-slate-700 prose-h3:font-bold prose-h3:border-b-2 prose-h3:border-slate-300 prose-h3:pb-2
                  prose-h4:text-lg prose-h4:mb-3 prose-h4:mt-6 prose-h4:text-gray-700 prose-h4:font-semibold
                  prose-h5:text-base prose-h5:mb-2 prose-h5:mt-4 prose-h5:text-gray-600 prose-h5:font-medium
                  prose-h6:text-sm prose-h6:mb-2 prose-h6:mt-3 prose-h6:text-gray-500 prose-h6:font-medium prose-h6:uppercase prose-h6:tracking-wide
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline prose-a:transition-all prose-a:duration-200 prose-a:border-b prose-a:border-blue-200 hover:prose-a:text-blue-800 hover:prose-a:border-blue-400 hover:prose-a:bg-blue-50 hover:prose-a:px-1 hover:prose-a:rounded
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  prose-ul:mb-6 prose-ul:space-y-2 prose-li:mb-0 prose-li:text-gray-700 prose-li:relative prose-li:pl-2 marker:prose-li:text-blue-500 marker:prose-li:text-lg
                  prose-ol:mb-6 prose-ol:space-y-2
                  prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
            
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Table of Contents */}
              <TableOfContents content={content} />
              
              {/* Service Info Card - Only show for service category articles */}
              {articleCategory === 'services' && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mr-4">
                      {!imageError && service.imageUrl ? (
                        <img 
                          src={service.imageUrl} 
                          alt={`${service.name} logo`}
                          className="w-8 h-8 object-contain"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-800">{service.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                  <a
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    公式サイトを見る
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <RelatedArticles relatedArticles={relatedArticles} />
          </div>
        )}
    </div>
  );
}
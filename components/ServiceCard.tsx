import { Service } from '../types';
import { useState } from 'react';
import Link from 'next/link';
import { trackAffiliateClick } from '../lib/analytics';

interface ServiceCardProps {
  service: Service;
  placement?: string;
  articleCategory?: string;
  articleId?: string;
}

const featureColors: { [key: string]: string } = {
  high_class: 'bg-red-100 text-red-800',
  for_beginner: 'bg-blue-100 text-blue-800',
  remote_work: 'bg-green-100 text-green-800',
  specialized: 'bg-yellow-100 text-yellow-800',
};

const featureText: { [key: string]: string } = {
  high_class: 'ハイクラス',
  for_beginner: '未経験者向け',
  remote_work: 'リモートワーク',
  specialized: '専門特化',
};

export default function ServiceCard({ service, placement = 'service_card', articleCategory, articleId }: ServiceCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleAffiliateClick = () => {
    trackAffiliateClick({
      affiliate_id: service.id,
      affiliate_url: service.url,
      service_name: service.name,
      placement,
      article_category: articleCategory,
      article_id: articleId
    });
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {service.name}
          </h3>
        </div>
        <div className="flex-shrink-0 w-16 h-16 bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-sm">
          {!imageError ? (
            <img 
              src={service.imageUrl} 
              alt={`${service.name} logo`}
              className="w-12 h-12 object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          )}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {service.features?.map(feature => (
          <span key={feature} className={`px-2.5 py-1 text-xs font-semibold rounded-full ${featureColors[feature] || 'bg-gray-100 text-gray-800'}`}>
            {featureText[feature] || feature}
          </span>
        ))}
      </div>
      
      <p className="text-gray-600 mb-6 leading-relaxed h-20 overflow-hidden relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-8 after:bg-gradient-to-t after:from-white after:to-transparent">
        {service.description}
      </p>
      
      <div className="space-y-3">
        <a
          href={service.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleAffiliateClick}
          className="group/official relative inline-flex items-center justify-center w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-100"
        >
          <span className="relative z-10 flex items-center">
            公式サイトへ
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </span>
        </a>

        <Link
          href={`/articles/${service.id}`}
          className="group/button relative inline-flex items-center justify-center w-full bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-bold shadow-sm hover:shadow-md hover:border-gray-400 transition-all duration-300 transform hover:scale-105 active:scale-100"
        >
          <span className="relative z-10 flex items-center">
            詳細を見る
          </span>
        </Link>
      </div>
    </div>
  );
}
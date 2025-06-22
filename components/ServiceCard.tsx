import { Service } from '../types';
import { useState } from 'react';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {service.name}
          </h3>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-3"></div>
        </div>
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
          {!imageError ? (
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
      </div>
      
      <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">{service.description}</p>
      
      <a
        href={service.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group/button relative inline-flex items-center justify-center w-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
      >
        {/* 背景のグラデーション効果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></div>
        
        {/* パルス効果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-indigo-500/30 opacity-0 group-hover/button:opacity-100 group-hover/button:animate-pulse transition-opacity duration-300"></div>
        
        {/* シマー効果 */}
        <div className="absolute inset-0 -translate-x-full group-hover/button:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        
        <span className="relative z-10 flex items-center">
          <svg className="w-5 h-5 mr-2 group-hover/button:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          詳細を見る
          <svg className="w-4 h-4 ml-2 group-hover/button:translate-x-1 group-hover/button:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </span>
        
        {/* ホバー時のライト効果 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent transform scale-x-0 group-hover/button:scale-x-100 transition-transform duration-500"></div>
      </a>
    </div>
  );
}
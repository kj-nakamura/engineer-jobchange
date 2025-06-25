import Link from 'next/link';
import { Service } from '../types';
import ServiceCard from './ServiceCard';

interface PopularServicesPreviewProps {
  services: Service[];
  onViewAll?: () => void;
}

export default function PopularServicesPreview({ services, onViewAll }: PopularServicesPreviewProps) {
  // 人気サービスを選定（最初の4件を表示）
  const popularServices = services.slice(0, 4);

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            人気の転職サービス
          </h2>
          <p className="text-gray-600">
            多くのエンジニアに選ばれているおすすめのサービス
          </p>
        </div>
        <Link
          href="/services"
          className="hidden sm:inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 text-blue-600 hover:text-blue-700 font-semibold rounded-xl border border-blue-200/50 hover:border-blue-300/70 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 group"
        >
          すべて見る
          <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {popularServices.map(service => (
          <ServiceCard 
            key={service.id} 
            service={service} 
            placement="popular_preview"
          />
        ))}
      </div>

      {/* モバイル用の「すべて見る」ボタン */}
      <div className="sm:hidden text-center mt-8">
        <Link
          href="/services"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:via-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95 group"
        >
          <svg className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          すべてのサービスを見る
          <svg className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
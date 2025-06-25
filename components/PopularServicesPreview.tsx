import Link from 'next/link';
import { Service } from '../types';
import ServiceCard from './ServiceCard';

interface PopularServicesPreviewProps {
  services: Service[];
  onViewAll: () => void;
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
        <button
          onClick={onViewAll}
          className="hidden sm:flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          すべて見る
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
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
      <div className="sm:hidden text-center mt-6">
        <button
          onClick={onViewAll}
          className="inline-flex items-center px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          すべてのサービスを見る
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
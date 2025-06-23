import { Service } from '../types';
import ServiceCard from './ServiceCard';

interface ServiceListProps {
  title: string;
  services: Service[];
  showWhenEmpty?: boolean;
}

export default function ServiceList({ title, services, showWhenEmpty = true }: ServiceListProps) {
  if (!showWhenEmpty && services.length === 0) {
    return null;
  }

  const isAllServices = title === "全ての転職サービス";
  
  return (
    <div id={isAllServices ? "services" : undefined} className="mb-12">
      <div className="flex items-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
          <span className="mr-3">{title}</span>
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            {services.length}件
          </span>
        </h2>
      </div>
      
      {services.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.084-2.332" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">該当するサービスがありません</p>
          <p className="text-gray-400 text-sm mt-2">別の条件を試してみてください</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {services.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
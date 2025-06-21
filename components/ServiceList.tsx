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

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">
        {title} ({services.length}件)
      </h2>
      {services.length === 0 ? (
        <p className="text-gray-500">該当するサービスがありません。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
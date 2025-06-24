import React from 'react';
import AffiliateButton from './AffiliateButton';

interface ServiceItem {
  name: string;
  url: string;
  rating: number;
  yearlyJobs: string;
  avgSalary: string;
  features: string[];
  pros: string[];
  cons: string[];
  recommended: string;
}

interface ServiceComparisonProps {
  services: ServiceItem[];
  title?: string;
  subtitle?: string;
}

const ServiceComparison: React.FC<ServiceComparisonProps> = ({
  services,
  title = "おすすめ転職サイト比較",
  subtitle = "あなたに最適な転職サイトを見つけましょう"
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < rating ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  return (
    <div className="my-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>

      <div className="grid gap-6 md:gap-8">
        {services.map((service, index) => (
          <div 
            key={service.name}
            className={`relative border rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${
              index === 0 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            {/* Recommended badge */}
            {index === 0 && (
              <div className="absolute -top-3 left-6">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  🏆 最もおすすめ
                </span>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Service Info */}
              <div className="lg:col-span-1">
                <div className="flex items-center mb-3">
                  <h3 className="text-xl font-bold text-gray-900 mr-3">{service.name}</h3>
                  <div className="flex items-center">
                    {renderStars(service.rating)}
                    <span className="ml-1 text-sm text-gray-600">({service.rating}.0)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="text-xs text-gray-500 mb-1">求人数</div>
                    <div className="font-semibold text-blue-600">{service.yearlyJobs}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="text-xs text-gray-500 mb-1">平均年収</div>
                    <div className="font-semibold text-green-600">{service.avgSalary}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-900 mb-2">おすすめの人</div>
                  <p className="text-sm text-gray-700 bg-white rounded-lg p-2 border">
                    {service.recommended}
                  </p>
                </div>
              </div>

              {/* Features & Pros/Cons */}
              <div className="lg:col-span-1">
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-900 mb-2">主な特徴</div>
                  <ul className="space-y-1">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start">
                        <span className="text-blue-500 mr-2 mt-0.5">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <div className="text-xs font-semibold text-green-700 mb-1">👍 メリット</div>
                    <ul className="space-y-1">
                      {service.pros.slice(0, 2).map((pro, idx) => (
                        <li key={idx} className="text-xs text-gray-600">• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-red-700 mb-1">👎 デメリット</div>
                    <ul className="space-y-1">
                      {service.cons.slice(0, 2).map((con, idx) => (
                        <li key={idx} className="text-xs text-gray-600">• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="lg:col-span-1 flex flex-col justify-center">
                <AffiliateButton
                  href={service.url}
                  text={`${service.name}を詳しく見る`}
                  variant={index === 0 ? 'primary' : 'secondary'}
                  size="lg"
                  trackingId={`comparison_${service.name.toLowerCase()}`}
                  fullWidth={true}
                  className="mb-3"
                />
                <p className="text-xs text-gray-500 text-center">
                  登録無料・最短3分で完了
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 text-center bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          💡 転職成功のコツ
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          複数のサイトに登録することで、より多くの求人に出会えて転職成功率がアップします。
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
          <span className="bg-white px-2 py-1 rounded">✓ 非公開求人へのアクセス</span>
          <span className="bg-white px-2 py-1 rounded">✓ 複数の選択肢で比較検討</span>
          <span className="bg-white px-2 py-1 rounded">✓ エージェントからの手厚いサポート</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceComparison;
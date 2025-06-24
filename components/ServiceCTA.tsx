import React from 'react';
import AffiliateButton from './AffiliateButton';

interface ServiceCTAProps {
  serviceName: string;
  serviceUrl: string;
  features: string[];
  recommendedFor: string[];
  ctaText?: string;
  variant?: 'primary' | 'secondary' | 'success';
  showFeatures?: boolean;
  className?: string;
}

const ServiceCTA: React.FC<ServiceCTAProps> = ({
  serviceName,
  serviceUrl,
  features,
  recommendedFor,
  ctaText,
  variant = 'primary',
  showFeatures = true,
  className = '',
}) => {
  const defaultCtaText = ctaText || `${serviceName}で転職活動を始める`;

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 my-8 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          🎯 {serviceName}がおすすめな理由
        </h3>
        <p className="text-gray-600 text-sm">
          あなたに最適な転職サイトで理想のキャリアを実現しましょう
        </p>
      </div>

      {showFeatures && (
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              主な特徴
            </h4>
            <ul className="space-y-2">
              {features.slice(0, 4).map((feature, index) => (
                <li key={index} className="flex items-start text-sm text-gray-700">
                  <span className="text-green-500 mr-2 mt-0.5">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              こんな人におすすめ
            </h4>
            <ul className="space-y-2">
              {recommendedFor.slice(0, 4).map((recommendation, index) => (
                <li key={index} className="flex items-start text-sm text-gray-700">
                  <span className="text-blue-500 mr-2 mt-0.5">👥</span>
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="text-center">
        <AffiliateButton
          href={serviceUrl}
          text={defaultCtaText}
          variant={variant}
          size="lg"
          trackingId={serviceName.toLowerCase()}
          fullWidth={true}
          className="text-lg font-bold"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <p className="text-xs text-gray-500 mt-2">
          ※ 登録無料・スマホからでもかんたん3分で完了
        </p>
      </div>

      {/* Trust indicators */}
      <div className="mt-4 pt-4 border-t border-blue-100">
        <div className="flex justify-center items-center space-x-6 text-xs text-gray-500">
          <div className="flex items-center">
            <span className="text-green-500 mr-1">🔒</span>
            SSL暗号化通信
          </div>
          <div className="flex items-center">
            <span className="text-blue-500 mr-1">📞</span>
            サポート充実
          </div>
          <div className="flex items-center">
            <span className="text-purple-500 mr-1">⭐</span>
            高評価多数
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCTA;
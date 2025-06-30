import { useState, useEffect } from 'react';
import { Tag, Service, UserConditions } from '../types';
import { advancedRecommendServices } from '../utils/recommend';

interface AdvancedTagSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: {
    motiveTags: Tag[];
    jobTypeTags: Tag[];
    salaryRanges: Tag[];
    workLocations: Tag[];
    companySizes: Tag[];
    industries: Tag[];
    techStacks: Tag[];
    experienceLevels: Tag[];
    benefits: Tag[];
  };
  onShowResults: (conditions: UserConditions) => void;
  services: Service[];
}

export default function AdvancedTagSelectionModal({
  isOpen,
  onClose,
  tags,
  onShowResults,
  services
}: AdvancedTagSelectionModalProps) {
  const [conditions, setConditions] = useState<UserConditions>({
    motiveTags: [],
    jobTypeTags: [],
    salaryRange: { min: 300, max: 1500 },
    workLocation: [],
    companySize: [],
    industries: [],
    techStack: [],
    experienceLevel: '',
    benefits: [],
    priorities: {
      salary: 3,
      workLocation: 3,
      companySize: 3,
      industry: 3,
      techStack: 3,
      benefits: 3
    }
  });

  const [matchCount, setMatchCount] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (services && services.length > 0) {
      const result = advancedRecommendServices(services, conditions);
      setMatchCount(result.exactMatch.length + result.partialMatch.length);
    }
  }, [conditions, services]);

  if (!isOpen) return null;

  const handleToggleTag = (category: keyof UserConditions, tagId: string) => {
    setConditions(prev => {
      const current = prev[category] as string[];
      const newValue = current.includes(tagId)
        ? current.filter(id => id !== tagId)
        : [...current, tagId];
      
      return {
        ...prev,
        [category]: newValue
      };
    });
  };

  const handleSalaryChange = (field: 'min' | 'max', value: number) => {
    setConditions(prev => ({
      ...prev,
      salaryRange: {
        ...prev.salaryRange,
        [field]: value
      }
    }));
  };

  const handlePriorityChange = (field: keyof UserConditions['priorities'], value: number) => {
    setConditions(prev => ({
      ...prev,
      priorities: {
        ...prev.priorities,
        [field]: value
      }
    }));
  };

  const handleExperienceChange = (level: string) => {
    setConditions(prev => ({
      ...prev,
      experienceLevel: level
    }));
  };

  const handleShowResults = () => {
    onShowResults(conditions);
    onClose();
  };

  const resetConditions = () => {
    setConditions({
      motiveTags: [],
      jobTypeTags: [],
      salaryRange: { min: 300, max: 1500 },
      workLocation: [],
      companySize: [],
      industries: [],
      techStack: [],
      experienceLevel: '',
      benefits: [],
      priorities: {
        salary: 3,
        workLocation: 3,
        companySize: 3,
        industry: 3,
        techStack: 3,
        benefits: 3
      }
    });
    setCurrentStep(1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            {/* 転職動機 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">転職動機</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {tags.motiveTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleToggleTag('motiveTags', tag.id)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      conditions.motiveTags.includes(tag.id)
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 職種 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">希望職種</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {tags.jobTypeTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleToggleTag('jobTypeTags', tag.id)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      conditions.jobTypeTags.includes(tag.id)
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            {/* 年収レンジ */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">希望年収レンジ</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">最低年収</label>
                    <input
                      type="range"
                      min="300"
                      max="2000"
                      step="50"
                      value={conditions.salaryRange.min}
                      onChange={(e) => handleSalaryChange('min', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-center text-sm text-gray-600 mt-1">
                      {conditions.salaryRange.min}万円
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">最高年収</label>
                    <input
                      type="range"
                      min="300"
                      max="2000"
                      step="50"
                      value={conditions.salaryRange.max}
                      onChange={(e) => handleSalaryChange('max', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-center text-sm text-gray-600 mt-1">
                      {conditions.salaryRange.max}万円
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 勤務地 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">希望勤務地</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {tags.workLocations.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleToggleTag('workLocation', tag.id)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      conditions.workLocation.includes(tag.id)
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 企業規模 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">希望企業規模</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {tags.companySizes.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleToggleTag('companySize', tag.id)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      conditions.companySize.includes(tag.id)
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            {/* 業界 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">希望業界</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {tags.industries.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleToggleTag('industries', tag.id)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      conditions.industries.includes(tag.id)
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 技術スタック */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">希望技術スタック</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {tags.techStacks.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleToggleTag('techStack', tag.id)}
                    className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                      conditions.techStack.includes(tag.id)
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 経験レベル */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">経験レベル</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {tags.experienceLevels.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleExperienceChange(tag.id)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      conditions.experienceLevel === tag.id
                        ? 'bg-teal-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            {/* 福利厚生・特徴 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">重視する特徴・福利厚生</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tags.benefits.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleToggleTag('benefits', tag.id)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                      conditions.benefits.includes(tag.id)
                        ? 'bg-pink-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 優先度設定 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">条件の重要度</h3>
              <div className="space-y-4">
                {Object.entries(conditions.priorities).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 w-24">
                      {key === 'salary' && '年収'}
                      {key === 'workLocation' && '勤務地'}
                      {key === 'companySize' && '企業規模'}
                      {key === 'industry' && '業界'}
                      {key === 'techStack' && '技術'}
                      {key === 'benefits' && '福利厚生'}
                    </span>
                    <div className="flex-1 mx-4">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={value}
                        onChange={(e) => handlePriorityChange(key as keyof UserConditions['priorities'], parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">
                      {value === 1 && '低'}
                      {value === 2 && 'やや低'}
                      {value === 3 && '普通'}
                      {value === 4 && 'やや高'}
                      {value === 5 && '高'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* オーバーレイ */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* モーダルコンテンツ */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          {/* ヘッダー */}
          <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">詳細条件設定</h2>
                <p className="text-gray-600 mt-1">
                  ステップ {currentStep}/4 - あなたにぴったりの転職サービスを見つけましょう
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* プログレスバー */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>基本条件</span>
                <span>年収・勤務地</span>
                <span>業界・技術</span>
                <span>特徴・重要度</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* コンテンツ */}
          <div className="p-6">
            {renderStep()}
          </div>

          {/* フッター */}
          <div className="sticky bottom-0 bg-white rounded-b-3xl border-t border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex space-x-3">
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    前へ
                  </button>
                )}
                <button
                  onClick={resetConditions}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  リセット
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  マッチ: {matchCount} サービス
                </div>
                
                {currentStep < 4 ? (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    次へ
                  </button>
                ) : (
                  <button
                    onClick={handleShowResults}
                    disabled={matchCount === 0}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    結果を見る ({matchCount})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Service, TagData, RecommendationResult } from '../types';
import { recommendServices } from '../utils/recommend';
import TagSelector from '../components/TagSelector';
import ServiceList from '../components/ServiceList';

export default function Services() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [tags, setTags] = useState<TagData>({ motiveTags: [], jobTypeTags: [] });
  const [selectedMotiveTags, setSelectedMotiveTags] = useState<string[]>([]);
  const [selectedJobTypeTags, setSelectedJobTypeTags] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesRes, tagsRes] = await Promise.all([
          fetch('/data/services.json'),
          fetch('/data/tags.json')
        ]);
        
        if (!servicesRes.ok || !tagsRes.ok) {
          throw new Error('データの取得に失敗しました');
        }
        
        const servicesData = await servicesRes.json();
        const tagsData = await tagsRes.json();
        
        setServices(servicesData);
        setTags(tagsData);
        setIsLoading(false);
        
        // クエリパラメータから条件を読み込み
        const { motiveTags, jobTypeTags } = router.query;
        if (motiveTags && typeof motiveTags === 'string') {
          setSelectedMotiveTags(motiveTags.split(','));
        }
        if (jobTypeTags && typeof jobTypeTags === 'string') {
          setSelectedJobTypeTags(jobTypeTags.split(','));
        }
      } catch (error) {
        console.error('データの読み込みに失敗しました:', error);
        setIsLoading(false);
      }
    };

    if (router.isReady) {
      loadData();
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if ((selectedMotiveTags.length > 0 || selectedJobTypeTags.length > 0) && services.length > 0) {
      const result = recommendServices(services, selectedMotiveTags, selectedJobTypeTags);
      setRecommendation(result);
    } else {
      setRecommendation(null);
    }
  }, [services, selectedMotiveTags, selectedJobTypeTags]);

  const handleMotiveTagToggle = (tagId: string) => {
    setSelectedMotiveTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleJobTypeTagToggle = (tagId: string) => {
    setSelectedJobTypeTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleClearFilters = () => {
    setSelectedMotiveTags([]);
    setSelectedJobTypeTags([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">サービス情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>転職サービス一覧 | エンジニア転職ナビ</title>
        <meta name="description" content="エンジニア向け転職サービスの一覧。条件を選択してあなたにぴったりのサービスを見つけましょう。" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            ホームに戻る
          </button>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            転職サービス一覧
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            条件を選択して、あなたにぴったりの転職サービスを見つけましょう
          </p>
        </div>

        {/* フィルター */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">条件で絞り込む</h2>
            {(selectedMotiveTags.length > 0 || selectedJobTypeTags.length > 0) && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg px-3 py-1 transition-colors"
              >
                条件をクリア
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TagSelector
              title="転職動機"
              tags={tags.motiveTags}
              selectedTags={selectedMotiveTags}
              onTagToggle={handleMotiveTagToggle}
            />
            <TagSelector
              title="職種"
              tags={tags.jobTypeTags}
              selectedTags={selectedJobTypeTags}
              onTagToggle={handleJobTypeTagToggle}
            />
          </div>
        </div>

        {/* 選択中の条件表示 */}
        {(selectedMotiveTags.length > 0 || selectedJobTypeTags.length > 0) && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
            <div className="flex items-center mb-3">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 2v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              <h3 className="font-semibold text-blue-900">選択中の条件</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedMotiveTags.map(tagId => {
                const tag = tags.motiveTags.find(t => t.id === tagId);
                return tag ? (
                  <span key={tagId} className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {tag.label}
                    <button
                      onClick={() => handleMotiveTagToggle(tagId)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
              {selectedJobTypeTags.map(tagId => {
                const tag = tags.jobTypeTags.find(t => t.id === tagId);
                return tag ? (
                  <span key={tagId} className="inline-flex items-center bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {tag.label}
                    <button
                      onClick={() => handleJobTypeTagToggle(tagId)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* サービス一覧 */}
        {recommendation ? (
          <div className="space-y-8">
            {/* 完全マッチ */}
            {selectedMotiveTags.length > 0 && selectedJobTypeTags.length > 0 && recommendation.exactMatch.length > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-green-900">
                    🎯 あなたにぴったりのサービス
                  </h2>
                </div>
                <p className="text-green-700 mb-6">
                  選択した転職動機と職種の両方にマッチするサービスです
                </p>
                <ServiceList
                  title=""
                  services={recommendation.exactMatch}
                  showWhenEmpty={false}
                />
              </div>
            )}

            {/* 部分マッチ */}
            {recommendation.partialMatch.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-blue-900">
                    💡 こちらもおすすめ
                  </h2>
                </div>
                <p className="text-blue-700 mb-6">
                  選択した条件の一部にマッチするサービスです
                </p>
                <ServiceList
                  title=""
                  services={recommendation.partialMatch}
                  showWhenEmpty={false}
                />
              </div>
            )}
          </div>
        ) : (
          <ServiceList
            title="全ての転職サービス"
            services={services}
          />
        )}
      </div>
    </>
  );
}
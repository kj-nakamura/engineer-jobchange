import { useState, useEffect } from 'react';
import { Service, TagData, RecommendationResult } from '../types';
import { recommendServices } from '../utils/recommend';
import TagSelector from '../components/TagSelector';
import ServiceList from '../components/ServiceList';

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [tags, setTags] = useState<TagData>({ motiveTags: [], jobTypeTags: [] });
  const [selectedMotiveTags, setSelectedMotiveTags] = useState<string[]>([]);
  const [selectedJobTypeTags, setSelectedJobTypeTags] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesRes, tagsRes] = await Promise.all([
          fetch('/data/services.json'),
          fetch('/data/tags.json')
        ]);
        
        const servicesData = await servicesRes.json();
        const tagsData = await tagsRes.json();
        
        setServices(servicesData);
        setTags(tagsData);
      } catch (error) {
        console.error('データの読み込みに失敗しました:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (selectedMotiveTags.length > 0 || selectedJobTypeTags.length > 0) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            エンジニア転職サービス比較
          </h1>
          <p className="text-lg text-gray-600">
            あなたの転職動機と職種から、最適な転職サービスを見つけましょう
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <TagSelector
              title="転職動機を選んでください（複数選択可）"
              tags={tags.motiveTags}
              selectedTags={selectedMotiveTags}
              onTagToggle={handleMotiveTagToggle}
            />

            <TagSelector
              title="希望職種を選んでください（複数選択可）"
              tags={tags.jobTypeTags}
              selectedTags={selectedJobTypeTags}
              onTagToggle={handleJobTypeTagToggle}
            />
          </div>

          {recommendation ? (
            <div>
              <ServiceList
                title="🎯 あなたにぴったりのサービス"
                services={recommendation.exactMatch}
              />
              
              <ServiceList
                title="💡 こちらもおすすめ"
                services={recommendation.partialMatch}
              />
            </div>
          ) : (
            <ServiceList
              title="全ての転職サービス"
              services={services}
            />
          )}
        </div>
      </div>
    </div>
  );
}
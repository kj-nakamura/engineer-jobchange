import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import { Service, TagData, RecommendationResult, UserConditions } from '../types';
import { recommendServices, advancedRecommendServices } from '../utils/recommend';
import { Article, articleCategories, getAllArticles } from '../utils/articles';
import ServiceList from '../components/ServiceList';
import ArticleList from '../components/ArticleList';
import CategoryArticleList from '../components/CategoryArticleList';
import TagSelectionModal from '../components/TagSelectionModal';
import AdvancedTagSelectionModal from '../components/AdvancedTagSelectionModal';
import PopularServicesPreview from '../components/PopularServicesPreview';
import fs from 'fs';
import path from 'path';

interface HomeProps {
  services: Service[];
  tags: TagData;
  allArticles: Article[];
}

export default function Home({ services, tags, allArticles }: HomeProps) {
  const router = useRouter();
  const [selectedMotiveTags, setSelectedMotiveTags] = useState<string[]>([]);
  const [selectedJobTypeTags, setSelectedJobTypeTags] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);

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

  const handleShowResults = () => {
    const params = new URLSearchParams();
    if (selectedMotiveTags.length > 0) {
      params.set('motiveTags', selectedMotiveTags.join(','));
    }
    if (selectedJobTypeTags.length > 0) {
      params.set('jobTypeTags', selectedJobTypeTags.join(','));
    }
    router.push(`/services?${params.toString()}`);
  };

  const handleViewAllServices = () => {
    router.push('/services');
  };

  const handleAdvancedResults = (conditions: UserConditions) => {
    // URLパラメータに詳細条件を含める
    const params = new URLSearchParams();
    params.set('advanced', 'true');
    params.set('conditions', encodeURIComponent(JSON.stringify(conditions)));
    router.push(`/services?${params.toString()}`);
  };

  const serviceArticles = allArticles.filter(article => article.category === 'services');
  const otherArticles = allArticles.filter(article => article.category !== 'services');

  return (
    <>
      <Head>
        <title>エンジニア転職ナビ | あなたにぴったりの転職サービスを見つけよう</title>
        <meta name="description" content="転職動機と職種から最適なエンジニア転職サービスを推薦。paiza転職、Green、Findy、レバテックキャリアなど主要な転職サイトを比較検討できます。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="エンジニア転職ナビ | あなたにぴったりの転職サービスを見つけよう" />
        <meta property="og:description" content="転職動機と職種から最適なエンジニア転職サービスを推薦。paiza転職、Green、Findy、レバテックキャリアなど主要な転職サイトを比較検討できます。" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="エンジニア転職ナビ | あなたにぴったりの転職サービスを見つけよう" />
        <meta name="twitter:description" content="転職動機と職種から最適なエンジニア転職サービスを推薦。paiza転職、Green、Findy、レバテックキャリアなど主要な転職サイトを比較検討できます。" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6">
            エンジニア転職ナビ
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
            あなたの転職動機と職種から、<br className="sm:hidden"/>
            <span className="font-semibold text-blue-700">最適な転職サービス</span>を見つけましょう
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-3xl mx-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                簡単検索
              </div>
            </button>
            <button
              onClick={() => setIsAdvancedModalOpen(true)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                詳細検索
              </div>
            </button>
            <button
              onClick={handleViewAllServices}
              className="flex-1 bg-white text-blue-600 px-6 py-4 rounded-2xl font-bold text-lg border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300"
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                全サービス
              </div>
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {services.length > 0 && (
            <PopularServicesPreview 
              services={services} 
            />
          )}
          
          <div>
            {serviceArticles.length > 0 && (
              <ArticleList articles={serviceArticles} />
            )}

            {otherArticles.length > 0 && (
              <CategoryArticleList 
                categories={articleCategories.filter(cat => cat.id !== 'services')} 
                articles={otherArticles} 
              />
            )}
          </div>
        </div>
        
        <TagSelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          motiveTags={tags.motiveTags}
          jobTypeTags={tags.jobTypeTags}
          selectedMotiveTags={selectedMotiveTags}
          selectedJobTypeTags={selectedJobTypeTags}
          onMotiveTagToggle={handleMotiveTagToggle}
          onJobTypeTagToggle={handleJobTypeTagToggle}
          onShowResults={handleShowResults}
          services={services}
        />
        
        <AdvancedTagSelectionModal
          isOpen={isAdvancedModalOpen}
          onClose={() => setIsAdvancedModalOpen(false)}
          tags={tags}
          onShowResults={handleAdvancedResults}
          services={services}
        />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const servicesPath = path.join(process.cwd(), 'public/data/services.json');
  const tagsPath = path.join(process.cwd(), 'public/data/tags.json');

  const services = JSON.parse(fs.readFileSync(servicesPath, 'utf-8'));
  const tags = JSON.parse(fs.readFileSync(tagsPath, 'utf-8'));
  const allArticles = getAllArticles();

  return {
    props: {
      services,
      tags,
      allArticles,
    },
  };
};
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Service, TagData, RecommendationResult } from '../types';
import { recommendServices } from '../utils/recommend';
import { generateArticles, Article, articleCategories } from '../utils/articles-client';
import TagSelector from '../components/TagSelector';
import ServiceList from '../components/ServiceList';
import ArticleList from '../components/ArticleList';
import CategoryArticleList from '../components/CategoryArticleList';
import TagSelectionModal from '../components/TagSelectionModal';
import PopularServicesPreview from '../components/PopularServicesPreview';

export default function Home() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [tags, setTags] = useState<TagData>({ motiveTags: [], jobTypeTags: [] });
  const [selectedMotiveTags, setSelectedMotiveTags] = useState<string[]>([]);
  const [selectedJobTypeTags, setSelectedJobTypeTags] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        
        if (process.env.NODE_ENV === 'development') {
          console.log('データ読み込み完了:', {
            servicesCount: servicesData.length,
            motiveTagsCount: tagsData.motiveTags.length,
            jobTypeTagsCount: tagsData.jobTypeTags.length
          });
        }
        
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'test') {
          const { act } = await import('@testing-library/react');
          act(() => {
            setServices(servicesData);
            setTags(tagsData);
          });
        } else {
          setServices(servicesData);
          setTags(tagsData);
        }
        
        // 記事データを生成
        const articlesData = generateArticles(servicesData);
        setArticles(articlesData);
        
        // 全記事を取得（JSONファイルから）
        try {
          const articlesRes = await fetch('/data/articles.json');
          if (articlesRes.ok) {
            const allArticlesData = await articlesRes.json();
            setAllArticles(allArticlesData);
          } else {
            console.log('記事データが見つかりません');
            setAllArticles([]);
          }
        } catch (error) {
          console.log('記事データの読み込みに失敗:', error);
          setAllArticles([]);
        }
      } catch (error) {
        console.error('データの読み込みに失敗しました:', error);
        alert('データの読み込みに失敗しました。ページを再読み込みしてください。');
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('レコメンド処理開始:', {
        servicesCount: services.length,
        selectedMotiveTags,
        selectedJobTypeTags
      });
      
      // デバッグ: サービスデータの最初の2件を確認
      if (services.length > 0) {
        console.log('サービスデータサンプル:', services.slice(0, 2).map(s => ({
          name: s.name,
          motiveTags: s.motiveTags,
          jobTypeTags: s.jobTypeTags
        })));
      }
    }
    
    if ((selectedMotiveTags.length > 0 || selectedJobTypeTags.length > 0) && services.length > 0) {
      const result = recommendServices(services, selectedMotiveTags, selectedJobTypeTags);
      if (process.env.NODE_ENV === 'development') {
        console.log('レコメンド結果:', {
          exactMatch: result.exactMatch.length,
          partialMatch: result.partialMatch.length,
          others: result.others.length
        });
      }
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
    // 選択した条件をクエリパラメータとして渡す
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
          
          {/* メインCTAボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                条件から探す
              </div>
            </button>
            <button
              onClick={handleViewAllServices}
              className="flex-1 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300"
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                全サービス一覧
              </div>
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {/* 人気サービスプレビュー */}
          {services.length > 0 && (
            <PopularServicesPreview 
              services={services} 
            />
          )}
          
          {/* 記事一覧 */}
          <div>
            {/* サービス記事リスト */}
            {articles.length > 0 && (
              <ArticleList articles={articles} />
            )}

            {/* カテゴリ別記事リスト */}
            {allArticles.length > 0 && (
              <CategoryArticleList 
                categories={articleCategories.filter(cat => cat.id !== 'services')} 
                articles={allArticles.filter(article => article.category !== 'services')} 
              />
            )}
          </div>
        </div>
        
        {/* タグ選択モーダル */}
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
      </div>
    </>
  );
}
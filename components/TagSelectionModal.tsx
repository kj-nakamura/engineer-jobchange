import { useState, useEffect } from 'react';
import { Tag } from '../types';

interface TagSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  motiveTags: Tag[];
  jobTypeTags: Tag[];
  selectedMotiveTags: string[];
  selectedJobTypeTags: string[];
  onMotiveTagToggle: (tagId: string) => void;
  onJobTypeTagToggle: (tagId: string) => void;
  onShowResults: () => void;
}

export default function TagSelectionModal({
  isOpen,
  onClose,
  motiveTags,
  jobTypeTags,
  selectedMotiveTags,
  selectedJobTypeTags,
  onMotiveTagToggle,
  onJobTypeTagToggle,
  onShowResults
}: TagSelectionModalProps) {
  const [matchCount, setMatchCount] = useState(0);

  useEffect(() => {
    // リアルタイムでマッチ件数を計算（仮実装）
    if (selectedMotiveTags.length > 0 || selectedJobTypeTags.length > 0) {
      // 実際の実装では親コンポーネントから渡すか、ここでサービス数を計算
      const estimatedCount = Math.max(1, 
        Math.floor(Math.random() * 10) + selectedMotiveTags.length + selectedJobTypeTags.length
      );
      setMatchCount(estimatedCount);
    } else {
      setMatchCount(0);
    }
  }, [selectedMotiveTags, selectedJobTypeTags]);

  if (!isOpen) return null;

  const handleShowResults = () => {
    onShowResults();
    onClose();
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
        <div className="relative bg-white rounded-3xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* ヘッダー */}
          <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">条件を選択</h2>
                <p className="text-gray-600 mt-1">あなたにぴったりの転職サービスを見つけましょう</p>
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
          </div>

          {/* コンテンツ */}
          <div className="p-6 space-y-8">
            {/* 転職動機セクション */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full mr-3"></div>
                転職動機を選んでください（複数選択可）
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {motiveTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => onMotiveTagToggle(tag.id)}
                    className={`group relative overflow-hidden px-5 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                      selectedMotiveTags.includes(tag.id)
                        ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30 border-2 border-blue-400/50'
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50'
                    }`}
                  >
                    <span className="relative z-20 flex items-center justify-center">
                      {tag.label}
                      {selectedMotiveTags.includes(tag.id) && (
                        <svg className="w-4 h-4 ml-2 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </button>
                ))}
              </div>
            </div>

            {/* 職種セクション */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full mr-3"></div>
                希望職種を選んでください（複数選択可）
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {jobTypeTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => onJobTypeTagToggle(tag.id)}
                    className={`group relative overflow-hidden px-5 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                      selectedJobTypeTags.includes(tag.id)
                        ? 'bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white shadow-xl shadow-green-500/30 border-2 border-green-400/50'
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-300 hover:shadow-lg hover:shadow-green-100/50 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50'
                    }`}
                  >
                    <span className="relative z-20 flex items-center justify-center">
                      {tag.label}
                      {selectedJobTypeTags.includes(tag.id) && (
                        <svg className="w-4 h-4 ml-2 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* フッター */}
          <div className="sticky bottom-0 bg-white rounded-b-3xl border-t border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {(selectedMotiveTags.length > 0 || selectedJobTypeTags.length > 0) && matchCount > 0 && (
                  <span className="inline-flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    約 {matchCount} 件のサービスがマッチします
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleShowResults}
                  disabled={selectedMotiveTags.length === 0 && selectedJobTypeTags.length === 0}
                  className={`w-full px-8 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    selectedMotiveTags.length > 0 || selectedJobTypeTags.length > 0
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  結果を見る
                </button>
                <button
                  onClick={onClose}
                  className="w-full px-6 py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
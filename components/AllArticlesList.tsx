import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Article, articleCategories } from '../utils/articles';

interface AllArticlesListProps {
  articles: Article[];
}

export default function AllArticlesList({ articles }: AllArticlesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // フィルタリングとソート
  const filteredAndSortedArticles = useMemo(() => {
    let filtered = articles;

    // カテゴリフィルター
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // 検索フィルター
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // ソート
    filtered.sort((a, b) => {
      const dateA = new Date(a.publishDate);
      const dateB = new Date(b.publishDate);
      return sortOrder === 'newest' 
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

    return filtered;
  }, [articles, searchTerm, selectedCategory, sortOrder]);

  // ページネーション計算
  const totalPages = Math.ceil(filteredAndSortedArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredAndSortedArticles.slice(startIndex, startIndex + itemsPerPage);

  // フィルター変更時にページを1に戻す
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: 'newest' | 'oldest') => {
    setSortOrder(value);
    setCurrentPage(1);
  };

  // カテゴリ名を取得
  const getCategoryName = (categoryId: string) => {
    const category = articleCategories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  // カテゴリ別の色分け
  const getCategoryColor = (categoryId: string) => {
    const colors: { [key: string]: string } = {
      'services': 'bg-blue-100 text-blue-800',
      'job-types': 'bg-green-100 text-green-800',
      'career-goals': 'bg-purple-100 text-purple-800',
      'guides': 'bg-orange-100 text-orange-800',
      'trends': 'bg-red-100 text-red-800',
      'comparisons': 'bg-yellow-100 text-yellow-800',
      'regions': 'bg-indigo-100 text-indigo-800'
    };
    return colors[categoryId] || 'bg-gray-100 text-gray-800';
  };

  // 日付フォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* 検索・フィルター */}
      <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* 検索ボックス */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="記事を検索..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* カテゴリフィルター */}
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">全カテゴリ</option>
              {articleCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* ソート */}
          <div className="md:w-32">
            <select
              value={sortOrder}
              onChange={(e) => handleSortChange(e.target.value as 'newest' | 'oldest')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">新しい順</option>
              <option value="oldest">古い順</option>
            </select>
          </div>
        </div>

        {/* 結果表示 */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>
            {filteredAndSortedArticles.length}件の記事
            {totalPages > 1 && (
              <span className="ml-2">
                （{currentPage}/{totalPages}ページ）
              </span>
            )}
            {searchTerm && (
              <span className="ml-2">
                「{searchTerm}」の検索結果
              </span>
            )}
          </span>
          {(searchTerm || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setCurrentPage(1);
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              フィルターをクリア
            </button>
          )}
        </div>
      </div>

      {/* 記事カードリスト */}
      {paginatedArticles.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center text-gray-500">
          <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium mb-2">該当する記事が見つかりません</p>
          <p className="text-sm">検索条件を変更してお試しください</p>
        </div>
      ) : (
        <>
          {/* カードグリッド */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedArticles.map((article) => (
              <div key={`${article.category}-${article.id}`} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden group">
                <Link href={`/articles/${article.id}`} className="block h-full">
                  <div className="p-6 h-full flex flex-col">
                    {/* カテゴリバッジと日付 */}
                    <div className="flex justify-between items-start mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                        {getCategoryName(article.category)}
                      </span>
                      <span className="text-sm text-gray-500">{formatDate(article.publishDate)}</span>
                    </div>

                    {/* タイトル */}
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3 text-lg leading-tight line-clamp-2">
                      {article.title}
                    </h3>

                    {/* 説明文 */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
                      {article.description}
                    </p>

                    {/* タグ */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {article.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                            {tag}
                          </span>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="text-xs text-gray-500 py-1">+{article.tags.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* 読むボタン（ホバー時表示） */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center text-blue-600 group-hover:text-blue-700 text-sm font-medium">
                        <span>記事を読む</span>
                        <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                {/* 前へボタン */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    currentPage === 1
                      ? 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
                      : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* ページ番号 */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // 現在のページの前後2ページ、最初と最後のページを表示
                  const shouldShow = 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 2 && page <= currentPage + 2);

                  if (!shouldShow) {
                    // 省略記号を表示
                    if (page === currentPage - 3 || page === currentPage + 3) {
                      return <span key={page} className="px-2 text-gray-400">...</span>;
                    }
                    return null;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        currentPage === page
                          ? 'text-blue-600 bg-blue-50 border-blue-200'
                          : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                {/* 次へボタン */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    currentPage === totalPages
                      ? 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
                      : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}
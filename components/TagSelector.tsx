import { Tag } from '../types';

interface TagSelectorProps {
  title: string;
  tags: Tag[];
  selectedTags: string[];
  onTagToggle: (tagId: string) => void;
}

export default function TagSelector({ title, tags, selectedTags, onTagToggle }: TagSelectorProps) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full mr-3"></div>
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {tags.map(tag => (
          <button
            key={tag.id}
            onClick={() => onTagToggle(tag.id)}
            className={`group relative overflow-hidden px-5 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
              selectedTags.includes(tag.id)
                ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30 border-2 border-blue-400/50'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50'
            }`}
          >
            {/* 背景のグラデーション効果 */}
            <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${
              selectedTags.includes(tag.id) 
                ? 'bg-gradient-to-br from-white/20 to-transparent opacity-100' 
                : 'group-hover:opacity-100 bg-gradient-to-br from-blue-100/50 to-indigo-100/50'
            }`}></div>
            
            {/* 選択時のパルス効果 */}
            {selectedTags.includes(tag.id) && (
              <div className="absolute inset-0 rounded-2xl animate-pulse bg-gradient-to-br from-blue-400/30 to-indigo-500/30"></div>
            )}
            
            <span className="relative z-20 flex items-center justify-center">
              {tag.label}
              {selectedTags.includes(tag.id) && (
                <svg className="w-4 h-4 ml-2 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </span>
            
            {/* ホバー時のシマー効果 */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </button>
        ))}
      </div>
    </div>
  );
}
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
            className={`group relative px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${
              selectedTags.includes(tag.id)
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-transparent shadow-lg shadow-blue-500/25'
                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <span className="relative z-10">{tag.label}</span>
            {selectedTags.includes(tag.id) && (
              <div className="absolute top-2 right-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
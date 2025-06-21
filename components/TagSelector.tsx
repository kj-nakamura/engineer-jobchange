import { Tag } from '../types';

interface TagSelectorProps {
  title: string;
  tags: Tag[];
  selectedTags: string[];
  onTagToggle: (tagId: string) => void;
}

export default function TagSelector({ title, tags, selectedTags, onTagToggle }: TagSelectorProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <button
            key={tag.id}
            onClick={() => onTagToggle(tag.id)}
            className={`px-4 py-2 rounded-full border text-sm transition-colors ${
              selectedTags.includes(tag.id)
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
}
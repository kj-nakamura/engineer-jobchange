import { useState, useEffect } from 'react';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // コンテンツからヘッダーを抽出して目次を生成
  useEffect(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    const headers = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const items: TocItem[] = [];
    
    headers.forEach((header, index) => {
      const level = parseInt(header.tagName.charAt(1));
      const title = header.textContent || '';
      let id = header.id;
      
      // IDがない場合は生成
      if (!id) {
        id = `heading-${index}`;
        header.id = id;
      }
      
      items.push({ id, title, level });
    });
    
    setTocItems(items);
    
    // 元のコンテンツのヘッダーにIDを設定
    const updatedContent = tempDiv.innerHTML;
    return () => {
      tempDiv.remove();
    };
  }, [content]);

  // スクロール位置に応じてアクティブなヘッダーと進捗を更新
  useEffect(() => {
    const handleScroll = () => {
      const headings = tocItems.map(item => document.getElementById(item.id)).filter(Boolean);
      
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading && heading.offsetTop <= window.scrollY + 100) {
          setActiveId(heading.id);
          break;
        }
      }

      // 進捗バーの更新
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  // ヘッダーまでスムーズスクロール
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - 100; // ヘッダー余白を考慮

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <h3 className="font-semibold text-gray-800">目次</h3>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg hover:bg-white/50 transition-colors"
          aria-label={isCollapsed ? '目次を展開' : '目次を折りたたむ'}
        >
          <svg 
            className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* 目次リスト */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'max-h-0' : 'max-h-96'} overflow-hidden`}>
        <nav className="p-4 max-h-80 overflow-y-auto">
          <ul className="space-y-1">
            {tocItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToHeading(item.id)}
                  className={`
                    w-full text-left transition-all duration-200 hover:bg-blue-50 group rounded-lg
                    ${activeId === item.id 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:text-blue-600'
                    }
                    ${item.level === 2 ? 'py-3 px-4' : 'py-2 px-6'}
                  `}
                  style={{ 
                    marginLeft: item.level === 2 ? '0' : '16px'
                  }}
                >
                  <div className="flex items-center">
                    {/* レベル別インジケーター */}
                    {item.level === 2 && (
                      <div className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 ${
                        activeId === item.id ? 'bg-blue-500' : 'bg-gray-300 group-hover:bg-blue-400'
                      }`}></div>
                    )}
                    {item.level === 3 && (
                      <div className={`w-1.5 h-1.5 rounded-full mr-3 flex-shrink-0 ${
                        activeId === item.id ? 'bg-blue-500' : 'bg-gray-400 group-hover:bg-blue-400'
                      }`}></div>
                    )}
                    {item.level >= 4 && (
                      <div className={`w-1 h-1 rounded-full mr-3 flex-shrink-0 ${
                        activeId === item.id ? 'bg-blue-500' : 'bg-gray-500 group-hover:bg-blue-400'
                      }`}></div>
                    )}
                    
                    <span className={`leading-relaxed ${
                      item.level === 2 ? 'text-sm font-semibold' :
                      item.level === 3 ? 'text-sm font-medium' :
                      'text-xs font-normal'
                    }`}>
                      {item.title}
                    </span>
                  </div>
                  
                  {/* アクティブ時の左ボーダー */}
                  {activeId === item.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full"></div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* プログレスバー */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center text-xs text-gray-600 mb-2">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          読書進捗
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-300"
            style={{ 
              width: `${scrollProgress}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
}
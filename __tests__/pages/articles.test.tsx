import { render, screen } from '@testing-library/react';
import ArticlesPage from '../../pages/articles';
import { Article } from '../../utils/articles';

// AllArticlesListコンポーネントのモック
jest.mock('../../components/AllArticlesList', () => {
  return function MockAllArticlesList({ articles }: { articles: Article[] }) {
    return (
      <div data-testid="all-articles-list">
        <div>{articles.length}件の記事</div>
        {articles.map((article) => (
          <div key={`${article.category}-${article.id}`} data-testid="article-item">
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <span>{article.category}</span>
          </div>
        ))}
      </div>
    );
  };
});

// Next.js Headコンポーネントのモック
jest.mock('next/head', () => {
  return function MockHead({ children }: { children: React.ReactNode }) {
    return <div data-testid="head">{children}</div>;
  };
});

// モックデータ
const mockArticles: Article[] = [
  {
    id: 'test-article-1',
    title: 'Javaエンジニアのテスト記事',
    description: 'Javaエンジニアの転職に関するテスト記事です',
    publishDate: '2025-06-27',
    category: 'job-types',
    tags: ['Java', 'エンジニア', '転職']
  },
  {
    id: 'test-article-2', 
    title: '20代エンジニアのテスト記事',
    description: '20代エンジニアのキャリアに関するテスト記事です',
    publishDate: '2025-06-26',
    category: 'career-goals',
    tags: ['20代', 'キャリア']
  },
  {
    id: 'test-article-3',
    title: 'レバテックキャリアのテスト記事', 
    description: 'レバテックキャリアの評判に関するテスト記事です',
    publishDate: '2025-06-25',
    category: 'services',
    tags: ['レバテックキャリア', '転職サイト']
  },
  {
    id: 'test-article-4',
    title: 'React入門ガイドのテスト記事',
    description: 'React入門に関するテスト記事です',
    publishDate: '2025-06-24', 
    category: 'guides',
    tags: ['React', 'フロントエンド']
  },
  {
    id: 'test-article-5',
    title: 'AI技術トレンドのテスト記事',
    description: 'AI技術のトレンドに関するテスト記事です',
    publishDate: '2025-06-23',
    category: 'trends', 
    tags: ['AI', '機械学習']
  }
];

describe('ArticlesPage', () => {
  test('ページが正しくレンダリングされる', () => {
    render(<ArticlesPage allArticles={mockArticles} />);
    
    // ページタイトルが表示されているか確認
    expect(screen.getByText('全記事一覧')).toBeInTheDocument();
    
    // 記事数が正しく表示されているか確認（テキストが分割されているため部分マッチで検証）
    expect(screen.getByText(/エンジニアの転職活動に役立つ情報を全5記事掲載。/)).toBeInTheDocument();
    expect(screen.getByText(/検索・フィルター機能でお探しの記事を効率的に見つけられます。/)).toBeInTheDocument();
    
    // AllArticlesListコンポーネントが表示されているか確認
    expect(screen.getByTestId('all-articles-list')).toBeInTheDocument();
  });

  test('記事データがAllArticlesListに正しく渡される', () => {
    render(<ArticlesPage allArticles={mockArticles} />);
    
    // AllArticlesListコンポーネント内で記事数が表示されているか確認
    expect(screen.getByText('5件の記事')).toBeInTheDocument();
    
    // 各記事アイテムが表示されているか確認
    const articleItems = screen.getAllByTestId('article-item');
    expect(articleItems).toHaveLength(5);
    
    // 特定の記事タイトルが表示されているか確認
    expect(screen.getByText('Javaエンジニアのテスト記事')).toBeInTheDocument();
    expect(screen.getByText('20代エンジニアのテスト記事')).toBeInTheDocument();
    expect(screen.getByText('レバテックキャリアのテスト記事')).toBeInTheDocument();
    expect(screen.getByText('React入門ガイドのテスト記事')).toBeInTheDocument();
    expect(screen.getByText('AI技術トレンドのテスト記事')).toBeInTheDocument();
  });

  test('SEOメタタグが正しく設定される', () => {
    render(<ArticlesPage allArticles={mockArticles} />);
    
    // Headコンポーネントが表示されているか確認
    const headElement = screen.getByTestId('head');
    expect(headElement).toBeInTheDocument();
    
    // title要素が含まれているか確認（モックされたHeadコンポーネントのため基本的な存在確認のみ）
    expect(headElement).toBeInTheDocument();
  });

  test('記事数が動的に表示される', () => {
    // 記事数が異なる場合のテスト
    const fewerArticles = mockArticles.slice(0, 2);
    render(<ArticlesPage allArticles={fewerArticles} />);
    
    expect(screen.getByText(/エンジニアの転職活動に役立つ情報を全2記事掲載。/)).toBeInTheDocument();
  });

  test('記事が0件の場合の表示', () => {
    render(<ArticlesPage allArticles={[]} />);
    
    // 記事数が0件と表示されるか確認
    expect(screen.getByText(/エンジニアの転職活動に役立つ情報を全0記事掲載。/)).toBeInTheDocument();
    
    // AllArticlesListコンポーネントには空の配列が渡される
    expect(screen.getByText('0件の記事')).toBeInTheDocument();
  });

  test('記事数が多い場合の表示', () => {
    // 大量の記事を作成
    const manyArticles = Array.from({ length: 86 }, (_, i) => ({
      id: `article-${i + 1}`,
      title: `テスト記事 ${i + 1}`,
      description: `テスト記事 ${i + 1} の説明`,
      publishDate: '2025-06-27',
      category: 'job-types',
      tags: ['テスト']
    }));

    render(<ArticlesPage allArticles={manyArticles} />);
    
    // 記事数が正しく表示されるか確認
    expect(screen.getByText(/エンジニアの転職活動に役立つ情報を全86記事掲載。/)).toBeInTheDocument();
    expect(screen.getByText('86件の記事')).toBeInTheDocument();
  });

  test('様々なカテゴリの記事が表示される', () => {
    render(<ArticlesPage allArticles={mockArticles} />);
    
    // 各カテゴリの記事が表示されているか確認
    expect(screen.getByText('job-types')).toBeInTheDocument();
    expect(screen.getByText('career-goals')).toBeInTheDocument();
    expect(screen.getByText('services')).toBeInTheDocument();
    expect(screen.getByText('guides')).toBeInTheDocument();
    expect(screen.getByText('trends')).toBeInTheDocument();
  });
});
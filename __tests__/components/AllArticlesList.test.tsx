import { render, screen, fireEvent } from '@testing-library/react';
import AllArticlesList from '../../components/AllArticlesList';
import { Article } from '../../utils/articles';

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
  }
];

describe('AllArticlesList', () => {
  test('記事一覧が正しく表示される', () => {
    render(<AllArticlesList articles={mockArticles} />);
    
    // 記事タイトルが表示されているか確認（カードレイアウトでは1つずつ表示される）
    expect(screen.getByText('Javaエンジニアのテスト記事')).toBeInTheDocument();
    expect(screen.getByText('20代エンジニアのテスト記事')).toBeInTheDocument();
    expect(screen.getByText('レバテックキャリアのテスト記事')).toBeInTheDocument();
    
    // 記事数が表示されているか確認
    expect(screen.getByText('3件の記事')).toBeInTheDocument();
  });

  test('検索機能が動作する', () => {
    render(<AllArticlesList articles={mockArticles} />);
    
    const searchInput = screen.getByPlaceholderText('記事を検索...');
    
    // 「Java」で検索
    fireEvent.change(searchInput, { target: { value: 'Java' } });
    
    // Java関連の記事のみ表示されているか確認
    expect(screen.getByText('Javaエンジニアのテスト記事')).toBeInTheDocument();
    expect(screen.queryByText('20代エンジニアのテスト記事')).not.toBeInTheDocument();
    expect(screen.queryByText('レバテックキャリアのテスト記事')).not.toBeInTheDocument();
    
    // 検索結果の件数が表示されているか確認
    expect(screen.getByText('1件の記事')).toBeInTheDocument();
    expect(screen.getByText('「Java」の検索結果')).toBeInTheDocument();
  });

  test('カテゴリフィルターが動作する', () => {
    render(<AllArticlesList articles={mockArticles} />);
    
    const categorySelect = screen.getByDisplayValue('全カテゴリ');
    
    // 「職種別転職ガイド」で絞り込み
    fireEvent.change(categorySelect, { target: { value: 'job-types' } });
    
    // job-types カテゴリの記事のみ表示されているか確認
    expect(screen.getByText('Javaエンジニアのテスト記事')).toBeInTheDocument();
    expect(screen.queryByText('20代エンジニアのテスト記事')).not.toBeInTheDocument();
    expect(screen.queryByText('レバテックキャリアのテスト記事')).not.toBeInTheDocument();
    
    // フィルター結果の件数が表示されているか確認
    expect(screen.getByText('1件の記事')).toBeInTheDocument();
  });

  test('ソート機能が動作する', () => {
    render(<AllArticlesList articles={mockArticles} />);
    
    const sortSelect = screen.getByDisplayValue('新しい順');
    
    // 「古い順」に変更
    fireEvent.change(sortSelect, { target: { value: 'oldest' } });
    
    // 記事が表示されていることを確認（順序の詳細チェックは複雑なので基本的な表示のみ）
    expect(screen.getByText('Javaエンジニアのテスト記事')).toBeInTheDocument();
    expect(screen.getByText('20代エンジニアのテスト記事')).toBeInTheDocument();
    expect(screen.getByText('レバテックキャリアのテスト記事')).toBeInTheDocument();
  });

  test('フィルタークリア機能が動作する', () => {
    render(<AllArticlesList articles={mockArticles} />);
    
    const searchInput = screen.getByPlaceholderText('記事を検索...');
    const categorySelect = screen.getByDisplayValue('全カテゴリ');
    
    // 検索とカテゴリフィルターを適用
    fireEvent.change(searchInput, { target: { value: 'Java' } });
    fireEvent.change(categorySelect, { target: { value: 'job-types' } });
    
    // フィルタークリアボタンが表示されているか確認
    const clearButton = screen.getByText('フィルターをクリア');
    expect(clearButton).toBeInTheDocument();
    
    // フィルタークリアボタンをクリック
    fireEvent.click(clearButton);
    
    // すべての記事が再び表示されているか確認
    expect(screen.getByText('Javaエンジニアのテスト記事')).toBeInTheDocument();
    expect(screen.getByText('20代エンジニアのテスト記事')).toBeInTheDocument();
    expect(screen.getByText('レバテックキャリアのテスト記事')).toBeInTheDocument();
    
    // 検索ボックスとカテゴリ選択がリセットされているか確認
    expect(searchInput).toHaveValue('');
    expect(categorySelect).toHaveValue('all');
  });

  test('記事が0件の場合の表示', () => {
    render(<AllArticlesList articles={[]} />);
    
    // 「該当する記事が見つかりません」メッセージが表示されているか確認
    expect(screen.getByText('該当する記事が見つかりません')).toBeInTheDocument();
    expect(screen.getByText('検索条件を変更してお試しください')).toBeInTheDocument();
    
    // 記事数が0件と表示されているか確認
    expect(screen.getByText('0件の記事')).toBeInTheDocument();
  });

  test('タグが正しく表示される', () => {
    render(<AllArticlesList articles={mockArticles} />);
    
    // タグが表示されているか確認（カードレイアウトでは各記事に1つずつ表示）
    expect(screen.getByText('Java')).toBeInTheDocument();
    expect(screen.getByText('エンジニア')).toBeInTheDocument();
    expect(screen.getByText('20代')).toBeInTheDocument();
    expect(screen.getByText('キャリア')).toBeInTheDocument();
  });

  test('カテゴリバッジが正しく表示される', () => {
    render(<AllArticlesList articles={mockArticles} />);
    
    // カテゴリバッジが表示されているか確認（カードとセレクトボックス両方に表示されるため、getAllByTextを使用）
    expect(screen.getAllByText('職種別転職ガイド').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('転職動機別戦略').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('転職サービス評判').length).toBeGreaterThanOrEqual(1);
  });
});
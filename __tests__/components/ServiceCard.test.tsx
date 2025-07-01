import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ServiceCard from '../../components/ServiceCard';
import { Service } from '../../types';

// モックデータ
const mockService: Service = {
  id: 'test-service',
  name: 'テストサービス',
  description: 'これはテスト用のサービスです。詳細な説明がここに入ります。',
  url: 'https://test-service.com',
  imageUrl: 'https://test-service.com/logo.png',
  motiveTags: ['high_salary', 'career_up'],
  jobTypeTags: ['frontend', 'backend']
};

// アナリティクス関数をモック
jest.mock('../../lib/analytics', () => ({
  trackAffiliateClick: jest.fn()
}));

describe('ServiceCard', () => {
  test('基本的なサービス情報が正しく表示される', () => {
    render(<ServiceCard service={mockService} />);
    
    expect(screen.getByText('テストサービス')).toBeInTheDocument();
    expect(screen.getByText('これはテスト用のサービスです。詳細な説明がここに入ります。')).toBeInTheDocument();
    expect(screen.getByText('公式サイトへ')).toBeInTheDocument();
  });

  test('公式サイトリンクが正しく設定される', () => {
    render(<ServiceCard service={mockService} />);
    
    const link = screen.getByRole('link', { name: /公式サイトへ/ });
    expect(link).toHaveAttribute('href', 'https://test-service.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('詳細記事リンクが正しく表示される', () => {
    render(<ServiceCard service={mockService} />);
    
    const detailLink = screen.getByRole('link', { name: /詳細を見る/ });
    expect(detailLink).toHaveAttribute('href', '/articles/test-service');
  });


  describe('画像表示', () => {
    test('画像が正しく表示される', () => {
      render(<ServiceCard service={mockService} />);
      
      const image = screen.getByAltText('テストサービス logo');
      expect(image).toHaveAttribute('src', 'https://test-service.com/logo.png');
    });

    test('画像読み込み失敗時にフォールバックアイコンが表示される', () => {
      const { container } = render(<ServiceCard service={mockService} />);
      
      const image = screen.getByAltText('テストサービス logo');
      
      // 画像読み込み失敗をシミュレート
      fireEvent.error(image);
      
      // SVGが表示されることを確認
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('アナリティクス', () => {
    test('公式サイトリンククリック時にアナリティクスが送信される', async () => {
      const { trackAffiliateClick } = require('../../lib/analytics');
      
      render(<ServiceCard service={mockService} placement="test_placement" />);
      
      const link = screen.getByRole('link', { name: /公式サイトへ/ });
      fireEvent.click(link);
      
      expect(trackAffiliateClick).toHaveBeenCalledWith({
        affiliate_id: 'test-service',
        affiliate_url: 'https://test-service.com',
        service_name: 'テストサービス',
        placement: 'test_placement',
        article_category: undefined,
        article_id: undefined
      });
    });

    test('記事コンテキスト情報が正しく送信される', () => {
      const { trackAffiliateClick } = require('../../lib/analytics');
      
      render(
        <ServiceCard 
          service={mockService} 
          articleCategory="services"
          articleId="test-article"
        />
      );
      
      const link = screen.getByRole('link', { name: /公式サイトへ/ });
      fireEvent.click(link);
      
      expect(trackAffiliateClick).toHaveBeenCalledWith({
        affiliate_id: 'test-service',
        affiliate_url: 'https://test-service.com',
        service_name: 'テストサービス',
        placement: 'service_card',
        article_category: 'services',
        article_id: 'test-article'
      });
    });
  });

  describe('レスポンシブデザイン', () => {
    test('カードコンポーネントが適切なCSS classを持つ', () => {
      const { container } = render(<ServiceCard service={mockService} />);
      
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('group', 'bg-white', 'rounded-2xl');
    });

    test('ホバー効果のためのCSS classが設定されている', () => {
      const { container } = render(<ServiceCard service={mockService} />);
      
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('hover:shadow-2xl', 'transition-all', 'transform', 'hover:-translate-y-1');
    });
  });

  describe('アクセシビリティ', () => {
    test('適切なaria-labelが設定されている', () => {
      render(<ServiceCard service={mockService} />);
      
      const link = screen.getByRole('link', { name: /公式サイトへ/ });
      expect(link).toBeInTheDocument();
    });

    test('画像にalt属性が正しく設定されている', () => {
      render(<ServiceCard service={mockService} />);
      
      const image = screen.getByAltText('テストサービス logo');
      expect(image).toBeInTheDocument();
    });

    test('キーボードナビゲーションに対応している', () => {
      render(<ServiceCard service={mockService} />);
      
      const link = screen.getByRole('link', { name: /公式サイトへ/ });
      
      // フォーカス可能であることを確認
      link.focus();
      expect(link).toHaveFocus();
    });
  });

  describe('エラーハンドリング', () => {
    test('不完全なサービスデータでもエラーにならない', () => {
      const incompleteService = {
        ...mockService,
        imageUrl: '',
        description: ''
      };
      
      expect(() => {
        render(<ServiceCard service={incompleteService} />);
      }).not.toThrow();
      
      expect(screen.getByText('テストサービス')).toBeInTheDocument();
    });

  });
});
import { render, screen, fireEvent } from '@testing-library/react'
import ArticleLayout from '../../components/ArticleLayout'
import { Service } from '../../types'

describe('ArticleLayout', () => {
  const mockService: Service = {
    id: 'test-service',
    name: 'テスト転職サービス',
    description: 'これはテスト用の転職サービスの説明文です。',
    url: 'https://example.com',
    imageUrl: 'https://example.com/favicon.ico',
    motiveTags: ['high_salary', 'career_up'],
    jobTypeTags: ['frontend', 'backend']
  }

  const mockProps = {
    service: mockService,
    title: 'テスト記事のタイトル',
    publishDate: '2025-06-23',
    content: '<h2>テスト見出し</h2><p>テスト本文です。</p>'
  }

  describe('レンダリング', () => {
    it('記事タイトルが正しく表示される', () => {
      render(<ArticleLayout {...mockProps} />)
      
      expect(screen.getByText('テスト記事のタイトル')).toBeInTheDocument()
    })

    it('サービス説明が正しく表示される', () => {
      render(<ArticleLayout {...mockProps} />)
      
      expect(screen.getByText(mockService.description)).toBeInTheDocument()
    })

    it('公開日が正しく表示される', () => {
      render(<ArticleLayout {...mockProps} />)
      
      expect(screen.getByText('公開日: 2025-06-23')).toBeInTheDocument()
    })

    it('記事コンテンツが正しく表示される', () => {
      render(<ArticleLayout {...mockProps} />)
      
      expect(screen.getByText('テスト見出し')).toBeInTheDocument()
      expect(screen.getByText('テスト本文です。')).toBeInTheDocument()
    })

    it('サービス画像が表示される', () => {
      render(<ArticleLayout {...mockProps} />)
      
      const image = screen.getByRole('img', { name: /テスト転職サービス logo/ })
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', 'https://example.com/favicon.ico')
    })
  })

  describe('ボタン機能', () => {
    it('公式サイトボタンが正しく設定される', () => {
      render(<ArticleLayout {...mockProps} />)
      
      const button = screen.getByRole('link', { name: /テスト転職サービスの公式サイトへ/ })
      expect(button).toHaveAttribute('href', 'https://example.com')
      expect(button).toHaveAttribute('target', '_blank')
      expect(button).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('ホームに戻るボタンが正しく設定される', () => {
      render(<ArticleLayout {...mockProps} />)
      
      const button = screen.getByRole('link', { name: /ホームに戻る/ })
      expect(button).toHaveAttribute('href', '/')
    })
  })

  describe('画像エラーハンドリング', () => {
    it('画像読み込みエラー時にフォールバックSVGが表示される', () => {
      render(<ArticleLayout {...mockProps} />)
      
      const image = screen.getByRole('img', { name: /テスト転職サービス logo/ })
      
      // 画像エラーをシミュレート
      fireEvent.error(image)
      
      // SVGフォールバックが表示されることを確認
      const svgElements = document.querySelectorAll('svg')
      expect(svgElements.length).toBeGreaterThan(0)
    })
  })

  describe('スタイリング', () => {
    it('適切なCSSクラスが適用される', () => {
      render(<ArticleLayout {...mockProps} />)
      
      // 背景グラデーションクラスをチェック
      const container = document.querySelector('.bg-gradient-to-br.from-blue-50')
      expect(container).toBeInTheDocument()
    })

    it('公式サイトボタンに緑色のグラデーションが適用される', () => {
      render(<ArticleLayout {...mockProps} />)
      
      const button = screen.getByRole('link', { name: /テスト転職サービスの公式サイトへ/ })
      expect(button).toHaveClass('from-green-500')
    })

    it('ホームボタンにグレーのグラデーションが適用される', () => {
      render(<ArticleLayout {...mockProps} />)
      
      const button = screen.getByRole('link', { name: /ホームに戻る/ })
      expect(button).toHaveClass('from-gray-500')
    })
  })

  describe('境界値テスト', () => {
    it('長いタイトルでも正しく表示される', () => {
      const longTitleProps = {
        ...mockProps,
        title: 'とても長いタイトルのテスト記事です。'.repeat(5)
      }
      
      render(<ArticleLayout {...longTitleProps} />)
      
      expect(screen.getByText(longTitleProps.title)).toBeInTheDocument()
    })

    it('空のコンテンツでもエラーが発生しない', () => {
      const emptyContentProps = {
        ...mockProps,
        content: ''
      }
      
      expect(() => {
        render(<ArticleLayout {...emptyContentProps} />)
      }).not.toThrow()
    })

    it('HTMLコンテンツが正しくレンダリングされる', () => {
      const htmlContentProps = {
        ...mockProps,
        content: '<strong>太字テキスト</strong><em>斜体テキスト</em>'
      }
      
      render(<ArticleLayout {...htmlContentProps} />)
      
      expect(screen.getByText('太字テキスト')).toBeInTheDocument()
      expect(screen.getByText('斜体テキスト')).toBeInTheDocument()
    })
  })

  describe('アクセシビリティ', () => {
    it('記事タイトルが見出しとして適切にマークアップされる', () => {
      render(<ArticleLayout {...mockProps} />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('テスト記事のタイトル')
    })

    it('すべてのリンクがフォーカス可能である', () => {
      render(<ArticleLayout {...mockProps} />)
      
      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(2)
      
      links.forEach(link => {
        expect(link).toBeVisible()
      })
    })
  })
})
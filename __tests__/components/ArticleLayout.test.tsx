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

    it('サービス説明がサイドバーに表示される（servicesカテゴリのみ）', () => {
      const servicesProps = {
        ...mockProps,
        articleCategory: 'services'
      }
      render(<ArticleLayout {...servicesProps} />)
      
      expect(screen.getByText(mockService.description)).toBeInTheDocument()
    })

    it('サービス情報ブロックが表示されない（servicesカテゴリ以外）', () => {
      const jobTypesProps = {
        ...mockProps,
        articleCategory: 'job-types'
      }
      render(<ArticleLayout {...jobTypesProps} />)
      
      expect(screen.queryByText(mockService.description)).not.toBeInTheDocument()
    })

    it('公開日が正しく表示される', () => {
      render(<ArticleLayout {...mockProps} />)
      
      expect(screen.getByText('公開日: 2025-06-23')).toBeInTheDocument()
    })

    it('記事コンテンツが正しく表示される', () => {
      render(<ArticleLayout {...mockProps} />)
      
      // h2要素として表示されているかチェック
      expect(screen.getByRole('heading', { level: 2, name: 'テスト見出し' })).toBeInTheDocument()
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
    it('サイドバーの公式サイトボタンが正しく設定される（servicesカテゴリのみ）', () => {
      const servicesProps = {
        ...mockProps,
        articleCategory: 'services'
      }
      render(<ArticleLayout {...servicesProps} />)
      
      const button = screen.getByRole('link', { name: /公式サイトを見る/ })
      expect(button).toHaveAttribute('href', 'https://example.com')
      expect(button).toHaveAttribute('target', '_blank')
      expect(button).toHaveAttribute('rel', 'noopener noreferrer')
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
      
      // メインコンテナのクラスをチェック
      const container = document.querySelector('.container.mx-auto')
      expect(container).toBeInTheDocument()
      
      // 白い背景のカードクラスをチェック
      const cardContainer = document.querySelector('.bg-white.rounded-2xl')
      expect(cardContainer).toBeInTheDocument()
    })

    it('サイドバーの公式サイトボタンに適切なスタイルが適用される', () => {
      const servicesProps = {
        ...mockProps,
        articleCategory: 'services'
      }
      render(<ArticleLayout {...servicesProps} />)
      
      const button = screen.getByRole('link', { name: /公式サイトを見る/ })
      expect(button).toHaveClass('bg-blue-600')
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

    it('基本的なレイアウトではリンクが表示されない', () => {
      render(<ArticleLayout {...mockProps} />)
      
      const links = screen.queryAllByRole('link')
      expect(links).toHaveLength(0) // 記事下のボタンは削除済み
    })

    it('servicesカテゴリではサイドバーに公式サイトリンクが表示される', () => {
      const servicesProps = {
        ...mockProps,
        articleCategory: 'services'
      }
      render(<ArticleLayout {...servicesProps} />)
      
      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(1) // サイドバーの公式サイトボタンのみ
      
      links.forEach(link => {
        expect(link).toBeVisible()
      })
    })
  })
})
import { render, screen, fireEvent } from '@testing-library/react'
import ServiceCard from '../../components/ServiceCard'
import { Service } from '../../types'

describe('ServiceCard', () => {
  const mockService: Service = {
    id: 'test-service',
    name: 'テスト転職サービス',
    description: 'これはテスト用の転職サービスの説明文です。エンジニア向けの求人を多数扱っています。',
    url: 'https://example.com',
    imageUrl: 'https://example.com/favicon.ico',
    motiveTags: ['high_salary', 'career_up'],
    jobTypeTags: ['frontend', 'backend']
  }

  describe('レンダリング', () => {
    it('サービス名が正しく表示される', () => {
      render(<ServiceCard service={mockService} />)
      
      expect(screen.getByText('テスト転職サービス')).toBeInTheDocument()
    })

    it('サービス説明が正しく表示される', () => {
      render(<ServiceCard service={mockService} />)
      
      expect(screen.getByText(mockService.description)).toBeInTheDocument()
    })

    it('詳細リンクが正しく設定される', () => {
      render(<ServiceCard service={mockService} />)
      
      const link = screen.getByRole('link', { name: /詳細を見る/ })
      expect(link).toHaveAttribute('href', 'https://example.com')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('サービス画像が表示される', () => {
      render(<ServiceCard service={mockService} />)
      
      const image = screen.getByRole('img', { name: /テスト転職サービス logo/ })
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', 'https://example.com/favicon.ico')
      expect(image).toHaveAttribute('alt', 'テスト転職サービス logo')
    })

    it('画像読み込みエラー時にフォールバックSVGが表示される', () => {
      render(<ServiceCard service={mockService} />)
      
      const image = screen.getByRole('img', { name: /テスト転職サービス logo/ })
      
      // 画像エラーをシミュレート
      fireEvent.error(image)
      
      // SVGフォールバックが表示されることを確認
      const svgElements = document.querySelectorAll('svg')
      expect(svgElements.length).toBeGreaterThan(0)
    })
  })

  describe('スタイリング', () => {
    it('カードに適切なCSSクラスが適用される', () => {
      render(<ServiceCard service={mockService} />)
      
      // カードのルートdivを取得
      const card = document.querySelector('.group.bg-white.rounded-2xl')
      expect(card).toBeInTheDocument()
    })

    it('ボタンに適切なCSSクラスが適用される', () => {
      render(<ServiceCard service={mockService} />)
      
      const button = screen.getByRole('link', { name: /詳細を見る/ })
      expect(button).toHaveClass('bg-gradient-to-br', 'from-blue-500')
    })
  })

  describe('アクセシビリティ', () => {
    it('リンクに適切なaria-labelが設定される', () => {
      render(<ServiceCard service={mockService} />)
      
      const link = screen.getByRole('link', { name: /詳細を見る/ })
      expect(link).toBeInTheDocument()
    })

    it('フォーカス可能な要素が存在する', () => {
      render(<ServiceCard service={mockService} />)
      
      const link = screen.getByRole('link')
      expect(link).toBeVisible()
    })
  })

  describe('境界値テスト', () => {
    it('長いサービス名でも正しく表示される', () => {
      const longNameService: Service = {
        ...mockService,
        name: 'とても長いサービス名の転職エージェントサービス株式会社'
      }
      
      render(<ServiceCard service={longNameService} />)
      
      expect(screen.getByText(longNameService.name)).toBeInTheDocument()
    })

    it('長い説明文でも正しく表示される', () => {
      const longDescService: Service = {
        ...mockService,
        description: 'これは非常に長い説明文です。'.repeat(10)
      }
      
      render(<ServiceCard service={longDescService} />)
      
      expect(screen.getByText(longDescService.description)).toBeInTheDocument()
    })

    it('空の説明文でもエラーが発生しない', () => {
      const emptyDescService: Service = {
        ...mockService,
        description: ''
      }
      
      expect(() => {
        render(<ServiceCard service={emptyDescService} />)
      }).not.toThrow()
    })

    it('無効なURLでもエラーが発生しない', () => {
      const invalidUrlService: Service = {
        ...mockService,
        url: 'invalid-url'
      }
      
      expect(() => {
        render(<ServiceCard service={invalidUrlService} />)
      }).not.toThrow()
      
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', 'invalid-url')
    })
  })

  describe('複数インスタンス', () => {
    it('複数のServiceCardが同時にレンダリングできる', () => {
      const services = [
        mockService,
        { ...mockService, id: 'service2', name: 'サービス2' },
        { ...mockService, id: 'service3', name: 'サービス3' }
      ]
      
      render(
        <div>
          {services.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )
      
      services.forEach(service => {
        expect(screen.getByText(service.name)).toBeInTheDocument()
      })
    })
  })
})
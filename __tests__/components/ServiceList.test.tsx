import { render, screen } from '@testing-library/react'
import ServiceList from '../../components/ServiceList'
import { Service } from '../../types'

// ServiceCardコンポーネントをモック
jest.mock('../../components/ServiceCard', () => {
  return function MockServiceCard({ service }: { service: Service }) {
    return <div data-testid={`service-card-${service.id}`}>{service.name}</div>
  }
})

describe('ServiceList', () => {
  const mockServices: Service[] = [
    {
      id: 'service1',
      name: 'テストサービス1',
      description: '説明1',
      url: 'https://example1.com',
      imageUrl: 'https://example1.com/favicon.ico',
      motiveTags: ['high_salary'],
      jobTypeTags: ['frontend'],
      features: [],
      popularity: 0
    },
    {
      id: 'service2',
      name: 'テストサービス2',
      description: '説明2',
      url: 'https://example2.com',
      imageUrl: 'https://example2.com/favicon.ico',
      motiveTags: ['remote_work'],
      jobTypeTags: ['backend'],
      features: [],
      popularity: 0
    }
  ]

  describe('レンダリング', () => {
    it('タイトルと件数が正しく表示される', () => {
      render(
        <ServiceList
          title="🎯 あなたにぴったりのサービス"
          services={mockServices}
        />
      )

      expect(screen.getByText('🎯 あなたにぴったりのサービス')).toBeInTheDocument()
      expect(screen.getByText('2件')).toBeInTheDocument()
    })

    it('全てのサービスが表示される', () => {
      render(
        <ServiceList
          title="テストタイトル"
          services={mockServices}
        />
      )

      mockServices.forEach(service => {
        expect(screen.getByTestId(`service-card-${service.id}`)).toBeInTheDocument()
      })
    })

    it('サービスが0件の場合、空状態メッセージが表示される', () => {
      render(
        <ServiceList
          title="テストタイトル"
          services={[]}
        />
      )

      expect(screen.getByText('該当するサービスがありません')).toBeInTheDocument()
      expect(screen.getByText('別の条件を試してみてください')).toBeInTheDocument()
    })
  })

  describe('showWhenEmptyプロパティ', () => {
    it('showWhenEmpty=falseかつサービスが空の場合、何も表示されない', () => {
      const { container } = render(
        <ServiceList
          title="テストタイトル"
          services={[]}
          showWhenEmpty={false}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('showWhenEmpty=trueかつサービスが空の場合、空状態が表示される', () => {
      render(
        <ServiceList
          title="テストタイトル"
          services={[]}
          showWhenEmpty={true}
        />
      )

      expect(screen.getByText('該当するサービスがありません')).toBeInTheDocument()
    })

    it('showWhenEmptyが未指定の場合、デフォルトでtrueとして動作する', () => {
      render(
        <ServiceList
          title="テストタイトル"
          services={[]}
        />
      )

      expect(screen.getByText('該当するサービスがありません')).toBeInTheDocument()
    })
  })

  describe('スタイリング', () => {
    it('タイトルに適切なCSSクラスが適用される', () => {
      render(
        <ServiceList
          title="テストタイトル"
          services={mockServices}
        />
      )

      const title = screen.getByText('テストタイトル')
      expect(title.closest('h2')).toHaveClass('text-2xl', 'font-bold')
    })

    it('件数バッジに適切なCSSクラスが適用される', () => {
      render(
        <ServiceList
          title="テストタイトル"
          services={mockServices}
        />
      )

      const badge = screen.getByText('2件')
      expect(badge).toHaveClass('bg-gradient-to-r', 'from-blue-500')
    })

    it('グリッドレイアウトのクラスが適用される', () => {
      render(
        <ServiceList
          title="テストタイトル"
          services={mockServices}
        />
      )

      const grid = screen.getByTestId('service-card-service1').parentElement
      expect(grid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2')
    })
  })

  describe('空状態のアイコン', () => {
    it('空状態でアイコンが表示される', () => {
      render(
        <ServiceList
          title="テストタイトル"
          services={[]}
        />
      )

      // SVGアイコンはrole="img"ではなく、クラス名で検証
      const iconContainer = screen.getByText('該当するサービスがありません').parentElement
      const iconDiv = iconContainer?.querySelector('.w-16.h-16')
      expect(iconDiv).toBeInTheDocument()
    })
  })

  describe('件数表示', () => {
    it('1件の場合も正しく表示される', () => {
      render(
        <ServiceList
          title="テストタイトル"
          services={[mockServices[0]]}
        />
      )

      expect(screen.getByText('1件')).toBeInTheDocument()
    })

    it('0件の場合も正しく表示される', () => {
      render(
        <ServiceList
          title="テストタイトル"
          services={[]}
        />
      )

      expect(screen.getByText('0件')).toBeInTheDocument()
    })

    it('多数の件数でも正しく表示される', () => {
      const manyServices = Array.from({ length: 100 }, (_, i) => ({
        ...mockServices[0],
        id: `service${i}`,
        name: `サービス${i}`
      }))

      render(
        <ServiceList
          title="テストタイトル"
          services={manyServices}
        />
      )

      expect(screen.getByText('100件')).toBeInTheDocument()
    })
  })

  describe('アクセシビリティ', () => {
    it('タイトルが適切な見出しレベルを持つ', () => {
      render(
        <ServiceList
          title="テストタイトル"
          services={mockServices}
        />
      )

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('テストタイトル')
    })
  })
})
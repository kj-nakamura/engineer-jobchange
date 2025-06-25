import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '../../pages/index'

// モックデータ
const mockServices = [
  {
    id: 'service1',
    name: 'テストサービス1',
    description: '説明1',
    url: 'https://example1.com',
    imageUrl: 'https://example1.com/favicon.ico',
    motiveTags: ['high_salary', 'career_up'],
    jobTypeTags: ['frontend', 'backend']
  },
  {
    id: 'service2',
    name: 'テストサービス2',
    description: '説明2',
    url: 'https://example2.com',
    imageUrl: 'https://example2.com/favicon.ico',
    motiveTags: ['remote_work'],
    jobTypeTags: ['generalist']
  }
]

const mockTags = {
  motiveTags: [
    { id: 'high_salary', label: '年収アップ' },
    { id: 'remote_work', label: 'フルリモート希望' },
    { id: 'career_up', label: 'キャリアアップ' }
  ],
  jobTypeTags: [
    { id: 'frontend', label: 'フロントエンドエンジニア' },
    { id: 'backend', label: 'バックエンドエンジニア' },
    { id: 'generalist', label: 'フルスタック' }
  ]
}

// コンポーネントをモック
jest.mock('../../components/TagSelector', () => {
  return function MockTagSelector({ title, tags, selectedTags, onTagToggle }: any) {
    return (
      <div data-testid="tag-selector">
        <h3>{title}</h3>
        {tags.map((tag: any) => (
          <button
            key={tag.id}
            onClick={() => onTagToggle(tag.id)}
            data-testid={`tag-${tag.id}`}
            className={selectedTags.includes(tag.id) ? 'selected' : ''}
          >
            {tag.label}
          </button>
        ))}
      </div>
    )
  }
})

jest.mock('../../components/ServiceList', () => {
  return function MockServiceList({ title, services }: any) {
    return (
      <div data-testid="service-list">
        <h2>{title} ({services.length}件)</h2>
        {services.map((service: any) => (
          <div key={service.id} data-testid={`service-${service.id}`}>
            {service.name}
          </div>
        ))}
      </div>
    )
  }
})

describe('Home Page', () => {
  beforeEach(() => {
    // fetchをモック
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockServices)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTags)
      })
      .mockResolvedValue({
        ok: false,
        status: 404
      })
    
    // scrollIntoViewをモック
    Element.prototype.scrollIntoView = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('初期レンダリング', () => {
    it('ページタイトルが表示される', async () => {
      render(<Home />)
      
      expect(screen.getByText('エンジニア転職ナビ')).toBeInTheDocument()
    })

    it('説明文が表示される', async () => {
      render(<Home />)
      
      expect(screen.getByText(/あなたの転職動機と職種から/)).toBeInTheDocument()
    })

    it('データ読み込み後にメインCTAボタンが表示される', async () => {
      render(<Home />)
      
      await waitFor(() => {
        expect(screen.getByText('条件から探す')).toBeInTheDocument()
      })
    })

    it('初期状態では人気サービスプレビューが表示される', async () => {
      render(<Home />)
      
      await waitFor(() => {
        expect(screen.getByText('人気の転職サービス')).toBeInTheDocument()
      })
    })
  })

  describe('データ読み込み', () => {
    it('正しいAPIエンドポイントを呼び出す', async () => {
      render(<Home />)
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/data/services.json')
        expect(fetch).toHaveBeenCalledWith('/data/tags.json')
      })
    })

    it('データ読み込みエラー時にアラートが表示される', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Fetch error'))
      global.alert = jest.fn()
      
      render(<Home />)
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          'データの読み込みに失敗しました。ページを再読み込みしてください。'
        )
      })
    })

    it('HTTPエラー時にアラートが表示される', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404
      })
      global.alert = jest.fn()
      
      render(<Home />)
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalled()
      })
    })
  })

  describe('UI操作', () => {
    it('CTAボタンが表示される', async () => {
      render(<Home />)
      
      expect(screen.getByText('条件から探す')).toBeInTheDocument()
      expect(screen.getByText('全サービス一覧')).toBeInTheDocument()
    })
  })

  describe('基本機能', () => {
    it('データ読み込み後に人気サービスが表示される', async () => {
      render(<Home />)
      
      await waitFor(() => {
        expect(screen.getByText('人気の転職サービス')).toBeInTheDocument()
      })
    })
  })

  describe('レスポンシブデザイン', () => {
    it('レスポンシブクラスが適用されている', async () => {
      render(<Home />)
      
      // コンテナにレスポンシブクラスが適用されているかチェック
      const container = screen.getByText('エンジニア転職ナビ').closest('.container')
      expect(container).toBeInTheDocument()
    })
  })

  describe('アクセシビリティ', () => {
    it('メインの見出しが適切に設定される', async () => {
      render(<Home />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('エンジニア転職ナビ')
    })
  })
})
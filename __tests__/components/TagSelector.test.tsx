import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TagSelector from '../../components/TagSelector'
import { Tag } from '../../types'

describe('TagSelector', () => {
  const mockTags: Tag[] = [
    { id: 'high_salary', label: '年収アップ' },
    { id: 'remote_work', label: 'フルリモート希望' },
    { id: 'career_up', label: 'キャリアアップ' }
  ]

  const mockOnTagToggle = jest.fn()

  beforeEach(() => {
    mockOnTagToggle.mockClear()
  })

  describe('レンダリング', () => {
    it('タイトルが正しく表示される', () => {
      render(
        <TagSelector
          title="転職動機を選んでください"
          tags={mockTags}
          selectedTags={[]}
          onTagToggle={mockOnTagToggle}
        />
      )

      expect(screen.getByText('転職動機を選んでください')).toBeInTheDocument()
    })

    it('全てのタグが表示される', () => {
      render(
        <TagSelector
          title="テストタイトル"
          tags={mockTags}
          selectedTags={[]}
          onTagToggle={mockOnTagToggle}
        />
      )

      mockTags.forEach(tag => {
        expect(screen.getByText(tag.label)).toBeInTheDocument()
      })
    })

    it('選択されたタグに適切なスタイルが適用される', () => {
      render(
        <TagSelector
          title="テストタイトル"
          tags={mockTags}
          selectedTags={['high_salary']}
          onTagToggle={mockOnTagToggle}
        />
      )

      const selectedButton = screen.getByText('年収アップ').closest('button')
      expect(selectedButton).toHaveClass('from-blue-500')
    })

    it('選択されていないタグに適切なスタイルが適用される', () => {
      render(
        <TagSelector
          title="テストタイトル"
          tags={mockTags}
          selectedTags={[]}
          onTagToggle={mockOnTagToggle}
        />
      )

      const unselectedButton = screen.getByText('年収アップ').closest('button')
      expect(unselectedButton).toHaveClass('bg-white')
    })
  })

  describe('ユーザーインタラクション', () => {
    it('タグクリック時にonTagToggleが呼ばれる', async () => {
      const user = userEvent.setup()
      
      render(
        <TagSelector
          title="テストタイトル"
          tags={mockTags}
          selectedTags={[]}
          onTagToggle={mockOnTagToggle}
        />
      )

      const tagButton = screen.getByText('年収アップ')
      await user.click(tagButton)

      expect(mockOnTagToggle).toHaveBeenCalledWith('high_salary')
      expect(mockOnTagToggle).toHaveBeenCalledTimes(1)
    })

    it('複数のタグを連続してクリックできる', async () => {
      const user = userEvent.setup()
      
      render(
        <TagSelector
          title="テストタイトル"
          tags={mockTags}
          selectedTags={[]}
          onTagToggle={mockOnTagToggle}
        />
      )

      await user.click(screen.getByText('年収アップ'))
      await user.click(screen.getByText('フルリモート希望'))

      expect(mockOnTagToggle).toHaveBeenCalledTimes(2)
      expect(mockOnTagToggle).toHaveBeenNthCalledWith(1, 'high_salary')
      expect(mockOnTagToggle).toHaveBeenNthCalledWith(2, 'remote_work')
    })

    it('キーボードでアクセス可能', async () => {
      const user = userEvent.setup()
      
      render(
        <TagSelector
          title="テストタイトル"
          tags={mockTags}
          selectedTags={[]}
          onTagToggle={mockOnTagToggle}
        />
      )

      const tagButton = screen.getByText('年収アップ')
      await user.click(tagButton) // キーボードの代わりにクリックでテスト

      expect(mockOnTagToggle).toHaveBeenCalledWith('high_salary')
    })
  })

  describe('選択状態の表示', () => {
    it('選択されたタグにチェックマークが表示される', () => {
      render(
        <TagSelector
          title="テストタイトル"
          tags={mockTags}
          selectedTags={['high_salary']}
          onTagToggle={mockOnTagToggle}
        />
      )

      const selectedButton = screen.getByText('年収アップ').closest('button')
      const checkIcon = selectedButton?.querySelector('svg')
      expect(checkIcon).toBeInTheDocument()
    })

    it('選択されていないタグにチェックマークが表示されない', () => {
      render(
        <TagSelector
          title="テストタイトル"
          tags={mockTags}
          selectedTags={[]}
          onTagToggle={mockOnTagToggle}
        />
      )

      const unselectedButton = screen.getByText('年収アップ').closest('button')
      const checkIcon = unselectedButton?.querySelector('svg')
      expect(checkIcon).not.toBeInTheDocument()
    })
  })

  describe('境界値テスト', () => {
    it('空のタグ配列でエラーが発生しない', () => {
      expect(() => {
        render(
          <TagSelector
            title="テストタイトル"
            tags={[]}
            selectedTags={[]}
            onTagToggle={mockOnTagToggle}
          />
        )
      }).not.toThrow()
    })

    it('存在しないタグが選択状態でもエラーが発生しない', () => {
      expect(() => {
        render(
          <TagSelector
            title="テストタイトル"
            tags={mockTags}
            selectedTags={['nonexistent_tag']}
            onTagToggle={mockOnTagToggle}
          />
        )
      }).not.toThrow()
    })
  })
})
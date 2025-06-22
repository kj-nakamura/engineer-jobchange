import { recommendServices } from '../../utils/recommend'
import { Service } from '../../types'

describe('recommendServices', () => {
  const mockServices: Service[] = [
    {
      id: 'service1',
      name: 'テストサービス1',
      description: 'フロントエンド・年収アップに特化',
      url: 'https://example1.com',
      imageUrl: 'https://example1.com/favicon.ico',
      motiveTags: ['high_salary', 'career_up'],
      jobTypeTags: ['frontend', 'backend']
    },
    {
      id: 'service2',
      name: 'テストサービス2',
      description: 'リモートワーク・フルスタック向け',
      url: 'https://example2.com',
      imageUrl: 'https://example2.com/favicon.ico',
      motiveTags: ['remote_work'],
      jobTypeTags: ['generalist']
    },
    {
      id: 'service3',
      name: 'テストサービス3',
      description: '管理職・マネジメント向け',
      url: 'https://example3.com',
      imageUrl: 'https://example3.com/favicon.ico',
      motiveTags: ['management'],
      jobTypeTags: ['pm']
    },
    {
      id: 'service4',
      name: 'テストサービス4',
      description: 'マッチしないサービス',
      url: 'https://example4.com',
      imageUrl: 'https://example4.com/favicon.ico',
      motiveTags: ['stable_env'],
      jobTypeTags: ['infra']
    }
  ]

  describe('完全マッチ（exactMatch）', () => {
    it('動機と職種の両方にマッチするサービスを返す', () => {
      const result = recommendServices(
        mockServices,
        ['high_salary'],
        ['frontend']
      )

      expect(result.exactMatch).toHaveLength(1)
      expect(result.exactMatch[0].id).toBe('service1')
    })

    it('複数の動機・職種でマッチするサービスを返す', () => {
      const result = recommendServices(
        mockServices,
        ['high_salary', 'career_up'],
        ['frontend', 'backend']
      )

      expect(result.exactMatch).toHaveLength(1)
      expect(result.exactMatch[0].id).toBe('service1')
    })

    it('マッチしない場合は空配列を返す', () => {
      const result = recommendServices(
        mockServices,
        ['high_salary'],
        ['ml']
      )

      expect(result.exactMatch).toHaveLength(0)
    })
  })

  describe('部分マッチ（partialMatch）', () => {
    it('動機のみマッチするサービスを返す', () => {
      const result = recommendServices(
        mockServices,
        ['remote_work'],
        ['nonexistent_job']
      )

      expect(result.partialMatch).toHaveLength(1)
      expect(result.partialMatch[0].id).toBe('service2')
    })

    it('職種のみマッチするサービスを返す', () => {
      const result = recommendServices(
        mockServices,
        ['nonexistent_motive'],
        ['pm']
      )

      expect(result.partialMatch).toHaveLength(1)
      expect(result.partialMatch[0].id).toBe('service3')
    })

    it('完全マッチしたサービスは部分マッチに含まない', () => {
      const result = recommendServices(
        mockServices,
        ['high_salary'],
        ['frontend']
      )

      expect(result.exactMatch).toHaveLength(1)
      expect(result.partialMatch).not.toContain(result.exactMatch[0])
    })
  })

  describe('その他（others）', () => {
    it('どちらにもマッチしないサービスを返す', () => {
      const result = recommendServices(
        mockServices,
        ['high_salary'],
        ['frontend']
      )

      expect(result.others).toContain(
        mockServices.find(s => s.id === 'service4')
      )
    })
  })

  describe('境界値テスト', () => {
    it('空のサービス配列でエラーが発生しない', () => {
      const result = recommendServices([], ['high_salary'], ['frontend'])

      expect(result.exactMatch).toHaveLength(0)
      expect(result.partialMatch).toHaveLength(0)
      expect(result.others).toHaveLength(0)
    })

    it('空の動機・職種配列でエラーが発生しない', () => {
      const result = recommendServices(mockServices, [], [])

      expect(result.exactMatch).toHaveLength(0)
      expect(result.partialMatch).toHaveLength(0)
      expect(result.others).toHaveLength(mockServices.length)
    })

    it('存在しないタグでエラーが発生しない', () => {
      const result = recommendServices(
        mockServices,
        ['nonexistent_motive'],
        ['nonexistent_job']
      )

      expect(result.exactMatch).toHaveLength(0)
      expect(result.partialMatch).toHaveLength(0)
      expect(result.others).toHaveLength(mockServices.length)
    })
  })

  describe('結果の整合性', () => {
    it('全てのサービスがいずれかのカテゴリに分類される', () => {
      const result = recommendServices(
        mockServices,
        ['high_salary'],
        ['frontend']
      )

      const totalServices = result.exactMatch.length + result.partialMatch.length + result.others.length
      expect(totalServices).toBe(mockServices.length)
    })

    it('サービスが重複しない', () => {
      const result = recommendServices(
        mockServices,
        ['high_salary', 'remote_work'],
        ['frontend', 'generalist']
      )

      const allResults = [...result.exactMatch, ...result.partialMatch, ...result.others]
      const uniqueIds = new Set(allResults.map(s => s.id))
      expect(uniqueIds.size).toBe(allResults.length)
    })
  })
})
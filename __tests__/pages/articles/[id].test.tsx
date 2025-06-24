import { getStaticPaths, getStaticProps } from '../../../pages/articles/[id]'
import fs from 'fs'
import path from 'path'

// モック
jest.mock('fs')
jest.mock('path')

const mockedFs = fs as jest.Mocked<typeof fs>
const mockedPath = path as jest.Mocked<typeof path>

describe('/articles/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getStaticPaths', () => {
    it('全てのサービスIDに対してパスを生成する', async () => {
      const mockServicesData = [
        { id: 'paiza', name: 'paiza転職' },
        { id: 'green', name: 'Green' },
        { id: 'findy', name: 'Findy' }
      ]

      const mockArticlesData = [
        { id: 'engineer-resume-writing-guide', title: 'エンジニア履歴書ガイド' },
        { id: 'salary-negotiation-complete-guide', title: '年収交渉術' },
        { id: 'career-change-to-engineer-guide', title: '異業種転職ガイド' }
      ]

      mockedPath.join
        .mockReturnValueOnce('/mock/path/services.json')
        .mockReturnValueOnce('/mock/path/articles.json')

      mockedFs.readFileSync
        .mockReturnValueOnce(JSON.stringify(mockServicesData))
        .mockReturnValueOnce(JSON.stringify(mockArticlesData))

      const result = await getStaticPaths()

      // サービスと記事の両方からパスが生成されることを確認
      expect(result.paths.length).toBeGreaterThanOrEqual(6)
      expect(result.paths).toContainEqual({ params: { id: 'paiza' } })
      expect(result.paths).toContainEqual({ params: { id: 'green' } })
      expect(result.paths).toContainEqual({ params: { id: 'findy' } })
      expect(result.paths).toContainEqual({ params: { id: 'engineer-resume-writing-guide' } })
      expect(result.fallback).toBe(false)
    })
  })

  describe('getStaticProps', () => {
    beforeEach(() => {
      mockedFs.readFileSync.mockClear()
      mockedFs.existsSync.mockClear()
      mockedPath.join.mockClear()
    })

    it('有効なサービスIDに対して正しいプロパティを返す', async () => {
      const mockServicesData = [
        {
          id: 'test-service',
          name: 'テストサービス',
          description: 'テスト説明',
          url: 'https://example.com',
          imageUrl: 'https://example.com/favicon.ico',
          motiveTags: ['high_salary'],
          jobTypeTags: ['frontend']
        }
      ]

      const mockArticlesData = [
        {
          id: 'test-service',
          title: 'テスト記事タイトル',
          description: 'テスト記事説明',
          publishDate: '2025-06-23',
          category: 'services',
          tags: ['test'],
          relatedArticles: []
        }
      ]

      const mockMarkdownContent = `---
title: "テスト記事タイトル"
description: "テスト記事説明"
publishDate: "2025-06-23"
---

# テスト見出し

テスト本文です。`

      mockedPath.join
        .mockReturnValueOnce('/mock/path/services.json')
        .mockReturnValueOnce('/mock/path/articles.json')
        .mockReturnValueOnce('/mock/path/articles/test-service.md')

      mockedFs.readFileSync
        .mockReturnValueOnce(JSON.stringify(mockServicesData))
        .mockReturnValueOnce(JSON.stringify(mockArticlesData))
        .mockReturnValueOnce(mockMarkdownContent)

      mockedFs.existsSync.mockReturnValue(true)

      const result = await getStaticProps({ params: { id: 'test-service' } })

      expect(result).toHaveProperty('props')
      if ('props' in result) {
        expect(result.props.service).toEqual(mockServicesData[0])
        expect(result.props.title).toBe('テスト記事タイトル')
        expect(result.props.description).toBe('テスト記事説明')
        expect(result.props.publishDate).toBe('2025-06-23')
        expect(result.props.content).toContain('<h1>テスト見出し</h1>')
        expect(result.props.content).toContain('<p>テスト本文です。</p>')
      }
    })

    it('frontmatterが不完全な場合にデフォルト値を使用する', async () => {
      const mockServicesData = [
        {
          id: 'test-service',
          name: 'テストサービス',
          description: 'テスト説明',
          url: 'https://example.com',
          imageUrl: 'https://example.com/favicon.ico',
          motiveTags: ['high_salary'],
          jobTypeTags: ['frontend']
        }
      ]

      const mockArticlesData = [
        {
          id: 'test-service',
          title: 'テスト記事タイトル',
          description: 'テスト記事説明',
          publishDate: '2025-06-23',
          category: 'services',
          tags: ['test'],
          relatedArticles: []
        }
      ]

      const mockMarkdownContent = `---
title: "テスト記事タイトル"
---

# テスト見出し

テスト本文です。`

      mockedPath.join
        .mockReturnValueOnce('/mock/path/services.json')
        .mockReturnValueOnce('/mock/path/articles.json')
        .mockReturnValueOnce('/mock/path/articles/test-service.md')

      mockedFs.readFileSync
        .mockReturnValueOnce(JSON.stringify(mockServicesData))
        .mockReturnValueOnce(JSON.stringify(mockArticlesData))
        .mockReturnValueOnce(mockMarkdownContent)

      mockedFs.existsSync.mockReturnValue(true)

      const result = await getStaticProps({ params: { id: 'test-service' } })

      expect(result).toHaveProperty('props')
      if ('props' in result) {
        expect(result.props.service).toEqual(mockServicesData[0])
        expect(result.props.title).toBe('テスト記事タイトル')
        expect(result.props.description).toBe('テスト説明') // サービスのdescriptionを使用
        expect(result.props.publishDate).toBe('2025-06-23') // 記事データから取得
      }
    })

    it('無効なサービスIDに対して404を返す', async () => {
      const mockServicesData = [
        {
          id: 'other-service',
          name: 'その他のサービス',
          description: 'その他の説明',
          url: 'https://example.com',
          imageUrl: 'https://example.com/favicon.ico',
          motiveTags: ['high_salary'],
          jobTypeTags: ['frontend']
        }
      ]

      const mockArticlesData = []

      mockedPath.join
        .mockReturnValueOnce('/mock/path/services.json')
        .mockReturnValueOnce('/mock/path/articles.json')

      mockedFs.readFileSync
        .mockReturnValueOnce(JSON.stringify(mockServicesData))
        .mockReturnValueOnce(JSON.stringify(mockArticlesData))

      const result = await getStaticProps({ params: { id: 'invalid-service' } })

      expect(result).toEqual({ notFound: true })
    })
  })
})
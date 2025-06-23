import { render, screen } from '@testing-library/react'
import ArticlePage, { getStaticProps, getStaticPaths } from '../../../pages/articles/[id]'
import { Service } from '../../../types'
import fs from 'fs'
import path from 'path'

// fsをモック
jest.mock('fs')
jest.mock('path')

const mockedFs = fs as jest.Mocked<typeof fs>
const mockedPath = path as jest.Mocked<typeof path>

describe('ArticlePage', () => {
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
    description: 'テスト記事の説明',
    publishDate: '2025-06-23',
    content: '<h2>テスト見出し</h2><p>テスト本文です。</p>'
  }

  describe('コンポーネントレンダリング', () => {
    it('ArticleLayoutコンポーネントに正しいプロパティが渡される', () => {
      render(<ArticlePage {...mockProps} />)
      
      expect(screen.getByText('テスト記事のタイトル')).toBeInTheDocument()
      expect(screen.getByText('これはテスト用の転職サービスの説明文です。')).toBeInTheDocument()
      expect(screen.getByText('公開日: 2025-06-23')).toBeInTheDocument()
      expect(screen.getByText('テスト見出し')).toBeInTheDocument()
      expect(screen.getByText('テスト本文です。')).toBeInTheDocument()
    })

    it('公式サイトリンクが正しく設定される', () => {
      render(<ArticlePage {...mockProps} />)
      
      const link = screen.getByRole('link', { name: /テスト転職サービスの公式サイトへ/ })
      expect(link).toHaveAttribute('href', 'https://example.com')
    })

    it('ホームに戻るリンクが正しく設定される', () => {
      render(<ArticlePage {...mockProps} />)
      
      const link = screen.getByRole('link', { name: /ホームに戻る/ })
      expect(link).toHaveAttribute('href', '/')
    })
  })
})

describe('getStaticPaths', () => {
  beforeEach(() => {
    mockedFs.readFileSync.mockClear()
    mockedPath.join.mockClear()
  })

  it('全てのサービスIDに対してパスを生成する', async () => {
    const mockServicesData = [
      { id: 'paiza', name: 'paiza転職' },
      { id: 'green', name: 'Green' },
      { id: 'findy', name: 'Findy' }
    ]

    mockedPath.join.mockReturnValue('/mock/path/services.json')
    mockedFs.readFileSync.mockReturnValue(JSON.stringify(mockServicesData))

    const result = await getStaticPaths()

    expect(result.paths).toEqual([
      { params: { id: 'paiza' } },
      { params: { id: 'green' } },
      { params: { id: 'findy' } }
    ])
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

    const mockMarkdownContent = `---
title: "テスト記事タイトル"
description: "テスト記事説明"
publishDate: "2025-06-23"
---

# テスト見出し

テスト本文です。`

    mockedPath.join
      .mockReturnValueOnce('/mock/path/services.json')
      .mockReturnValueOnce('/mock/path/articles/test-service.md')

    mockedFs.readFileSync
      .mockReturnValueOnce(JSON.stringify(mockServicesData))
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

  it('存在しないサービスIDに対してnotFoundを返す', async () => {
    const mockServicesData = [
      { id: 'existing-service', name: 'Existing Service' }
    ]

    mockedPath.join.mockReturnValue('/mock/path/services.json')
    mockedFs.readFileSync.mockReturnValue(JSON.stringify(mockServicesData))

    const result = await getStaticProps({ params: { id: 'non-existing-service' } })

    expect(result).toEqual({ notFound: true })
  })

  it('Markdownファイルが存在しない場合にnotFoundを返す', async () => {
    const mockServicesData = [
      { id: 'test-service', name: 'Test Service' }
    ]

    mockedPath.join
      .mockReturnValueOnce('/mock/path/services.json')
      .mockReturnValueOnce('/mock/path/articles/test-service.md')

    mockedFs.readFileSync.mockReturnValueOnce(JSON.stringify(mockServicesData))
    mockedFs.existsSync.mockReturnValue(false)

    const result = await getStaticProps({ params: { id: 'test-service' } })

    expect(result).toEqual({ notFound: true })
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

    const mockMarkdownContent = `---
title: "テスト記事タイトル"
---

# テスト見出し

テスト本文です。`

    mockedPath.join
      .mockReturnValueOnce('/mock/path/services.json')
      .mockReturnValueOnce('/mock/path/articles/test-service.md')

    mockedFs.readFileSync
      .mockReturnValueOnce(JSON.stringify(mockServicesData))
      .mockReturnValueOnce(mockMarkdownContent)

    mockedFs.existsSync.mockReturnValue(true)

    const result = await getStaticProps({ params: { id: 'test-service' } })

    expect(result).toHaveProperty('props')
    if ('props' in result) {
      expect(result.props.title).toBe('テスト記事タイトル')
      expect(result.props.description).toBe('テスト説明') // サービスの説明をフォールバック
      expect(result.props.publishDate).toBe('2025-06-23') // デフォルト日付
    }
  })
})
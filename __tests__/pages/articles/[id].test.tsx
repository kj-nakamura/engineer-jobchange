import { getStaticPaths, getStaticProps } from '../../../pages/articles/[id]';
import fs from 'fs';
import path from 'path';
import * as articleUtils from '../../../utils/articles';

// Mocks
jest.mock('fs');
jest.mock('path');
jest.mock('../../../utils/articles');

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedPath = path as jest.Mocked<typeof path>;
const mockedArticleUtils = articleUtils as jest.Mocked<typeof articleUtils>;

describe('/articles/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getStaticPaths', () => {
    it('should generate paths for all articles', async () => {
      const mockArticles = [
        { id: 'article-1', category: 'guides' },
        { id: 'article-2', category: 'trends' },
      ];
      mockedArticleUtils.getAllArticles.mockReturnValue(mockArticles as any);

      const result = await getStaticPaths({});

      expect(result.paths).toEqual([
        { params: { id: 'article-1' } },
        { params: { id: 'article-2' } },
      ]);
      expect(result.fallback).toBe(false);
    });
  });

  describe('getStaticProps', () => {
    it('should return correct props for a valid article ID', async () => {
      const mockArticle = {
        id: 'test-article',
        title: 'Test Article',
        description: 'Test Description',
        publishDate: '2025-01-01',
        category: 'guides',
        relatedArticles: [],
      };
      const mockServicesData = [{ id: 'some-service' }];
      const mockMarkdownContent = `---
title: "Test Article"
description: "Test Description"
publishDate: "2025-01-01"
---

# Test Heading

Test content.`;

      mockedArticleUtils.getAllArticles.mockReturnValue([mockArticle] as any);
      mockedPath.join.mockImplementation((...args) => args.join('/'));
      mockedFs.readFileSync.mockReturnValueOnce(JSON.stringify(mockServicesData));
      mockedFs.readFileSync.mockReturnValueOnce(mockMarkdownContent);
      mockedFs.existsSync.mockReturnValue(true);

      const result = await getStaticProps({ params: { id: 'test-article' } });

      expect(result).toHaveProperty('props');
      if ('props' in result) {
        expect(result.props.title).toBe('Test Article');
        expect(result.props.content).toContain('<p>Test content.</p>');
      }
    });

    it('should return notFound for an invalid article ID', async () => {
      mockedArticleUtils.getAllArticles.mockReturnValue([]);
      const result = await getStaticProps({ params: { id: 'invalid-article' } });
      expect(result).toEqual({ notFound: true });
    });
  });
});

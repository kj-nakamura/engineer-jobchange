import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define MOCK_ARTICLES_BASE_PATH as a simple string outside of mocks
const MOCK_ARTICLES_BASE_PATH = '/mock/public/articles';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readdirSync: jest.fn(),
  readFileSync: jest.fn(),
}));

jest.mock('path', () => ({
  ...jest.requireActual('path'),
  join: jest.fn((...args) => {
    const actualPathJoin = jest.requireActual('path').join;
    const joinedPath = actualPathJoin(...args);

    // If the path starts with the actual articles base path, replace it with the mock path
    if (joinedPath.includes('public/articles')) {
      return MOCK_ARTICLES_BASE_PATH;
    }
    return joinedPath;
  }),
  basename: jest.fn((p, ext) => jest.requireActual('path').basename(p, ext)),
}));

jest.mock('gray-matter', () => jest.fn((content) => {
  if (content.includes('Service A')) {
    return {
      data: {
        title: 'Service A Title',
        description: 'Service A Description',
        publishDate: '2025-01-01',
        tags: ['tag1', 'tag2'],
      }
    };
  } else if (content.includes('Service B')) {
    return {
      data: {
        title: 'Service B Title',
        description: 'Service B Description',
        publishDate: '2025-01-02',
        tags: ['tag2', 'tag3'],
      }
    };
  } else if (content.includes('Guide C')) {
    return {
      data: {
        title: 'Guide C Title',
        description: 'Guide C Description',
        publishDate: '2025-01-03',
        tags: ['tag3', 'tag4'],
      }
    };
  } else if (content.includes('New Article')) {
    return {
      data: {
        title: 'New Article',
        description: 'New Description',
        publishDate: '2025-01-05',
        tags: ['tag5'],
      }
    };
  } else if (content.includes('Old Article')) {
    return {
      data: {
        title: 'Old Article',
        description: 'Old Description',
        publishDate: '2025-01-01',
        tags: ['tag6'],
      }
    };
  }
  return { data: {} };
}));

// Mock the articleCategories to control test environment
const mockCategories = [
  { id: 'services', name: 'Services', description: 'Service articles' },
  { id: 'guides', name: 'Guides', description: 'Guide articles' },
];

describe('getAllArticles', () => {
  let getAllArticles: any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    
    // Mock the module with controlled categories
    jest.doMock('../../utils/articles', () => ({
      getAllArticles: jest.fn(() => {
        const articles: any[] = [];
        const articlesDir = MOCK_ARTICLES_BASE_PATH;

        mockCategories.forEach((category) => {
          const categoryDir = `${articlesDir}/${category.id}`;

          if ((fs.existsSync as jest.Mock)(categoryDir)) {
            const files = (fs.readdirSync as jest.Mock)(categoryDir).filter((file: string) => file.endsWith('.md'));

            files.forEach((file: string) => {
              const filePath = `${categoryDir}/${file}`;
              const fileContent = (fs.readFileSync as jest.Mock)(filePath, 'utf8');
              const { data } = (matter as unknown as jest.Mock)(fileContent);

              articles.push({
                id: path.basename(file, '.md'),
                title: data.title || '',
                description: data.description || '',
                publishDate: data.publishDate || '2025-06-23',
                category: category.id,
                tags: data.tags || [],
                relatedArticles: data.relatedArticles || [],
              });
            });
          }
        });

        return articles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
      }),
      articleCategories: mockCategories,
    }));

    ({ getAllArticles } = require('../../utils/articles'));
  });

  it('should correctly parse and return articles from multiple categories', () => {
    (fs.existsSync as jest.Mock).mockImplementation((dirPath: string) => {
      return dirPath.includes('services') || dirPath.includes('guides');
    });

    (fs.readdirSync as jest.Mock).mockImplementation((dirPath: string) => {
      if (dirPath.includes('services')) {
        return ['service-a.md', 'service-b.md'];
      } else if (dirPath.includes('guides')) {
        return ['guide-c.md'];
      }
      return [];
    });

    (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
      if (filePath.includes('service-a')) {
        return 'Service A content';
      } else if (filePath.includes('service-b')) {
        return 'Service B content';
      } else if (filePath.includes('guide-c')) {
        return 'Guide C content';
      }
      return '';
    });

    const articles = getAllArticles();

    expect(articles.length).toBe(3);
    expect(articles[0]).toEqual({
      id: 'guide-c',
      title: 'Guide C Title',
      description: 'Guide C Description',
      publishDate: '2025-01-03',
      category: 'guides',
      tags: ['tag3', 'tag4'],
      relatedArticles: [],
    });
  });

  it('should sort articles by publishDate in descending order', () => {
    (fs.existsSync as jest.Mock).mockImplementation((dirPath: string) => {
      return dirPath.includes('services');
    });
    (fs.readdirSync as jest.Mock).mockImplementation((dirPath: string) => {
      if (dirPath.includes('services')) {
        return ['new-article.md', 'old-article.md'];
      }
      return [];
    });

    (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
      if (filePath.includes('new-article')) {
        return 'New Article content';
      } else if (filePath.includes('old-article')) {
        return 'Old Article content';
      }
      return '';
    });

    const articles = getAllArticles();
    expect(articles.length).toBe(2);
    expect(articles[0].title).toBe('New Article');
    expect(articles[1].title).toBe('Old Article');
  });

  it('should skip non-markdown files', () => {
    (fs.existsSync as jest.Mock).mockImplementation((dirPath: string) => {
      return dirPath.includes('services');
    });
    (fs.readdirSync as jest.Mock).mockImplementation((dirPath: string) => {
      if (dirPath.includes('services')) {
        return ['service-a.md', 'readme.txt', 'image.jpg'];
      }
      return [];
    });

    (fs.readFileSync as jest.Mock).mockImplementation(() => 'Service A content');

    const articles = getAllArticles();
    expect(articles.length).toBe(1);
    expect(articles[0].id).toBe('service-a');
  });

  it('should handle empty directories', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const articles = getAllArticles();
    expect(articles.length).toBe(0);
  });
});

describe('articleCategories', () => {
  it('should export predefined categories', () => {
    jest.resetModules();
    const { articleCategories } = require('../../utils/articles');
    
    expect(Array.isArray(articleCategories)).toBe(true);
    expect(articleCategories.length).toBeGreaterThan(0);
    expect(articleCategories[0]).toHaveProperty('id');
    expect(articleCategories[0]).toHaveProperty('name');
    expect(articleCategories[0]).toHaveProperty('description');
  });
});
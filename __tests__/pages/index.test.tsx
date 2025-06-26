import { render, screen, waitFor } from '@testing-library/react';
import Home from '../../pages/index';
import { Service, TagData, Article } from '../../types';

// Mock data
const mockServices: Service[] = [
  {
    id: 'service1',
    name: 'Test Service 1',
    description: 'Description 1',
    url: 'https://example1.com',
    tags: [],
    motiveTags: ['high_salary'],
    jobTypeTags: ['frontend'],
    features: [],
    pros: [],
    cons: [],
    suitableFor: [],
    pricing: '',
    registration: ''
  },
];

const mockTags: TagData = {
  motiveTags: [{ id: 'high_salary', name: 'High Salary' }],
  jobTypeTags: [{ id: 'frontend', name: 'Frontend' }],
};

const mockArticles: Article[] = [
  {
    id: 'article1',
    title: 'Test Article 1',
    description: 'Article Description 1',
    publishDate: '2025-01-01',
    category: 'services',
    tags: [],
    relatedArticles: []
  },
  {
    id: 'article2',
    title: 'Test Article 2',
    description: 'Article Description 2',
    publishDate: '2025-01-02',
    category: 'guides',
    tags: [],
    relatedArticles: []
  },
];

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home services={mockServices} tags={mockTags} allArticles={mockArticles} />);
    expect(screen.getByRole('heading', { name: /エンジニア転職ナビ/i })).toBeInTheDocument();
  });

  it('renders popular services', () => {
    render(<Home services={mockServices} tags={mockTags} allArticles={mockArticles} />);
    expect(screen.getByText('人気の転職サービス')).toBeInTheDocument();
    expect(screen.getByText('Test Service 1')).toBeInTheDocument();
  });

  it('renders service articles', () => {
    render(<Home services={mockServices} tags={mockTags} allArticles={mockArticles} />);
    expect(screen.getByText('Test Article 1')).toBeInTheDocument();
  });

  it('renders other articles', () => {
    render(<Home services={mockServices} tags={mockTags} allArticles={mockArticles} />);
    expect(screen.getByText('Test Article 2')).toBeInTheDocument();
  });
});

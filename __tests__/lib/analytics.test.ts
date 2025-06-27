// Mock gtag function
const mockGtag = jest.fn();

// Mock localStorage and sessionStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

const sessionStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

// Mock fetch API
const mockFetch = jest.spyOn(global, 'fetch');

describe('Analytics Utilities', () => {
  const originalGA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
  const originalLocalStorage = Object.getOwnPropertyDescriptor(window, 'localStorage');
  const originalSessionStorage = Object.getOwnPropertyDescriptor(window, 'sessionStorage');

  beforeEach(() => {
    // Reset mocks and environment variables
    mockGtag.mockClear();
    localStorageMock.clear();
    sessionStorageMock.clear();
    mockFetch.mockClear();

    // Mock window objects
    Object.defineProperty(window, 'gtag', {
      value: mockGtag,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
      writable: true,
      configurable: true,
    });

    // Reset environment variables for each test
    process.env.NEXT_PUBLIC_GA_ID = 'G-TESTID';

    // Reset modules to avoid side effects
    jest.resetModules();
  });

  afterEach(() => {
    jest.restoreAllMocks();

    // Restore original environment variable
    process.env.NEXT_PUBLIC_GA_ID = originalGA_TRACKING_ID;

    // Restore original storage
    if (originalLocalStorage) {
      Object.defineProperty(window, 'localStorage', originalLocalStorage);
    }
    if (originalSessionStorage) {
      Object.defineProperty(window, 'sessionStorage', originalSessionStorage);
    }
  });

  describe('pageview', () => {
    it('should call gtag config when analytics is enabled', () => {
      const { pageview } = require('../../lib/analytics');
      pageview('/test-path');
      expect(mockGtag).toHaveBeenCalledWith('config', 'G-TESTID', { page_location: '/test-path' });
    });

    it('should not call gtag config when analytics is disabled', () => {
      process.env.NEXT_PUBLIC_GA_ID = '';
      jest.resetModules();
      const { pageview: disabledPageview } = require('../../lib/analytics');
      
      disabledPageview('/test-path');
      expect(mockGtag).not.toHaveBeenCalled();
    });
  });

  describe('event', () => {
    it('should call gtag event when analytics is enabled', () => {
      const { event } = require('../../lib/analytics');
      event({ action: 'test_action', category: 'test_category', label: 'test_label', value: 10 });
      expect(mockGtag).toHaveBeenCalledWith('event', 'test_action', {
        event_category: 'test_category',
        event_label: 'test_label',
        value: 10,
      });
    });

    it('should not call gtag event when analytics is disabled', () => {
      process.env.NEXT_PUBLIC_GA_ID = '';
      jest.resetModules();
      const { event: disabledEvent } = require('../../lib/analytics');
      
      disabledEvent({ action: 'test_action', category: 'test_category' });
      expect(mockGtag).not.toHaveBeenCalled();
    });

    it('should include custom parameters', () => {
      const { event } = require('../../lib/analytics');
      event({ action: 'test_action', category: 'test_category', custom_parameters: { param1: 'value1' } });
      expect(mockGtag).toHaveBeenCalledWith('event', 'test_action', {
        event_category: 'test_category',
        param1: 'value1',
      });
    });
  });

  describe('trackAffiliateClick', () => {
    const mockData = {
      affiliate_id: 'test-affiliate',
      affiliate_url: 'https://example.com',
      service_name: 'Test Service',
      placement: 'article',
      article_category: 'test',
      article_id: 'test-article',
    };

    it('should track affiliate click and store in localStorage when analytics is enabled', () => {
      const { trackAffiliateClick } = require('../../lib/analytics');
      trackAffiliateClick(mockData);

      expect(mockGtag).toHaveBeenCalledWith('event', 'affiliate_click', expect.any(Object));
      const storedData = JSON.parse(localStorageMock.getItem('affiliate_clicks') || '[]');
      expect(storedData.length).toBe(1);
      expect(storedData[0]).toMatchObject(mockData);
    });

    it('should not track affiliate click when analytics is disabled', () => {
      process.env.NEXT_PUBLIC_GA_ID = '';
      jest.resetModules();
      const { trackAffiliateClick: disabledTrackAffiliateClick } = require('../../lib/analytics');
      
      disabledTrackAffiliateClick(mockData);

      expect(mockGtag).not.toHaveBeenCalled();
      expect(localStorageMock.getItem('affiliate_clicks')).toBeNull();
    });

    it('should send analytics data when clicks reach threshold', async () => {
      const { trackAffiliateClick } = require('../../lib/analytics');
      mockFetch.mockResolvedValueOnce({ ok: true } as Response);

      for (let i = 0; i < 10; i++) {
        trackAffiliateClick({ ...mockData, affiliate_id: `aff${i}` });
      }

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(localStorageMock.getItem('affiliate_clicks')).toBeNull();
    });

    it('should not send analytics data if less than threshold', () => {
      const { trackAffiliateClick } = require('../../lib/analytics');
      mockFetch.mockResolvedValueOnce({ ok: true } as Response);

      for (let i = 0; i < 9; i++) {
        trackAffiliateClick({ ...mockData, affiliate_id: `aff${i}` });
      }

      expect(mockFetch).not.toHaveBeenCalled();
      expect(localStorageMock.getItem('affiliate_clicks')).not.toBeNull();
    });
  });

  describe('trackArticleEngagement', () => {
    it('should call gtag event for article engagement', () => {
      const { trackArticleEngagement } = require('../../lib/analytics');
      trackArticleEngagement('article-1', 'category-a', 'start_reading');
      expect(mockGtag).toHaveBeenCalledWith('event', 'article_start_reading', {
        event_category: 'engagement',
        event_label: 'article-1',
        article_category: 'category-a',
        article_id: 'article-1',
      });
    });

    it('should not track when analytics is disabled', () => {
      process.env.NEXT_PUBLIC_GA_ID = '';
      jest.resetModules();
      const { trackArticleEngagement: disabledTrackArticleEngagement } = require('../../lib/analytics');
      
      disabledTrackArticleEngagement('article-1', 'category-a', 'start_reading');
      expect(mockGtag).not.toHaveBeenCalled();
    });
  });

  describe('trackSearch', () => {
    it('should call gtag event for search', () => {
      const { trackSearch } = require('../../lib/analytics');
      trackSearch('test query', 5, 'test-category');
      expect(mockGtag).toHaveBeenCalledWith('event', 'search', {
        event_category: 'site_search',
        event_label: 'test query',
        value: 5,
        search_category: 'test-category',
      });
    });

    it('should not track when analytics is disabled', () => {
      process.env.NEXT_PUBLIC_GA_ID = '';
      jest.resetModules();
      const { trackSearch: disabledTrackSearch } = require('../../lib/analytics');
      
      disabledTrackSearch('test query', 5, 'test-category');
      expect(mockGtag).not.toHaveBeenCalled();
    });
  });
});
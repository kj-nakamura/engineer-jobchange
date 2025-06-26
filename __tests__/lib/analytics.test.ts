import { pageview, event, trackAffiliateClick, trackArticleEngagement, trackSearch, GA_TRACKING_ID, ANALYTICS_ENABLED } from '../../lib/analytics';

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

Object.defineProperty(window, 'gtag', {
  value: mockGtag,
  writable: true,
});

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock fetch API
const mockFetch = jest.spyOn(global, 'fetch');

describe('Analytics Utilities', () => {
  const originalGA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
  const originalANALYTICS_ENABLED = ANALYTICS_ENABLED;

  beforeEach(() => {
    mockGtag.mockClear();
    localStorageMock.clear();
    sessionStorageMock.clear();
    mockFetch.mockClear();
    jest.useFakeTimers(); // Use fake timers for setInterval

    // Reset environment variables for each test
    process.env.NEXT_PUBLIC_GA_ID = originalGA_TRACKING_ID;
    Object.defineProperty(require('../../lib/analytics'), 'ANALYTICS_ENABLED', {
      value: !!process.env.NEXT_PUBLIC_GA_ID,
      writable: true,
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // Clear any pending timers
    jest.useRealTimers(); // Restore real timers
    jest.restoreAllMocks();

    // Restore original values
    process.env.NEXT_PUBLIC_GA_ID = originalGA_TRACKING_ID;
    Object.defineProperty(require('../../lib/analytics'), 'ANALYTICS_ENABLED', {
      value: originalANALYTICS_ENABLED,
      writable: true,
    });
  });

  describe('pageview', () => {
    it('should call gtag config when analytics is enabled', () => {
      process.env.NEXT_PUBLIC_GA_ID = 'G-TESTID';
      Object.defineProperty(require('../../lib/analytics'), 'ANALYTICS_ENABLED', { value: true });
      pageview('/test-path');
      expect(mockGtag).toHaveBeenCalledWith('config', 'G-TESTID', { page_location: '/test-path' });
    });

    it('should not call gtag config when analytics is disabled', () => {
      process.env.NEXT_PUBLIC_GA_ID = '';
      Object.defineProperty(require('../../lib/analytics'), 'ANALYTICS_ENABLED', { value: false });
      pageview('/test-path');
      expect(mockGtag).not.toHaveBeenCalled();
    });
  });

  describe('event', () => {
    it('should call gtag event when analytics is enabled', () => {
      process.env.NEXT_PUBLIC_GA_ID = 'G-TESTID';
      Object.defineProperty(require('../../lib/analytics'), 'ANALYTICS_ENABLED', { value: true });
      event({ action: 'test_action', category: 'test_category', label: 'test_label', value: 10 });
      expect(mockGtag).toHaveBeenCalledWith('event', 'test_action', {
        event_category: 'test_category',
        event_label: 'test_label',
        value: 10,
      });
    });

    it('should not call gtag event when analytics is disabled', () => {
      process.env.NEXT_PUBLIC_GA_ID = '';
      Object.defineProperty(require('../../lib/analytics'), 'ANALYTICS_ENABLED', { value: false });
      event({ action: 'test_action', category: 'test_category' });
      expect(mockGtag).not.toHaveBeenCalled();
    });

    it('should include custom parameters', () => {
      process.env.NEXT_PUBLIC_GA_ID = 'G-TESTID';
      Object.defineProperty(require('../../lib/analytics'), 'ANALYTICS_ENABLED', { value: true });
      event({ action: 'test_action', category: 'test_category', custom_parameters: { param1: 'value1' } });
      expect(mockGtag).toHaveBeenCalledWith('event', 'test_action', {
        event_category: 'test_category',
        param1: 'value1',
      });
    });
  });

  describe('trackAffiliateClick', () => {
    const mockData = {
      affiliate_id: 'aff1',
      affiliate_url: 'http://example.com',
      service_name: 'Service A',
      placement: 'top',
    };

    it('should track affiliate click and store in localStorage when analytics is enabled', () => {
      process.env.NEXT_PUBLIC_GA_ID = 'G-TESTID';
      Object.defineProperty(require('../../lib/analytics'), 'ANALYTICS_ENABLED', { value: true });
      trackAffiliateClick(mockData);

      expect(mockGtag).toHaveBeenCalledWith('event', 'affiliate_click', expect.any(Object));
      const storedData = JSON.parse(localStorageMock.getItem('affiliate_clicks') || '[]');
      expect(storedData.length).toBe(1);
      expect(storedData[0]).toMatchObject(mockData);
    });

    it('should not track affiliate click when analytics is disabled', () => {
      process.env.NEXT_PUBLIC_GA_ID = '';
      Object.defineProperty(require('../../lib/analytics'), 'ANALYTICS_ENABLED', { value: false });
      trackAffiliateClick(mockData);

      expect(mockGtag).not.toHaveBeenCalled();
      expect(localStorageMock.getItem('affiliate_clicks')).toBeNull();
    });

    it('should send analytics data when clicks reach threshold', async () => {
      process.env.NEXT_PUBLIC_GA_ID = 'G-TESTID';
      Object.defineProperty(require('../../lib/analytics'), 'ANALYTICS_ENABLED', { value: true });
      mockFetch.mockResolvedValueOnce({ ok: true } as Response);

      for (let i = 0; i < 10; i++) {
        trackAffiliateClick({ ...mockData, affiliate_id: `aff${i}` });
      }

      // Advance timers to trigger setInterval (if any) and ensure fetch is called
      jest.runAllTimers();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(localStorageMock.getItem('affiliate_clicks')).toBeNull(); // Should be cleared after sending
    });

    it('should not send analytics data if less than threshold', () => {
      process.env.NEXT_PUBLIC_GA_ID = 'G-TESTID';
      Object.defineProperty(require('../../lib/analytics'), 'ANALYTICS_ENABLED', { value: true });
      mockFetch.mockResolvedValueOnce({ ok: true } as Response);

      for (let i = 0; i < 9; i++) {
        trackAffiliateClick({ ...mockData, affiliate_id: `aff${i}` });
      }

      jest.runAllTimers();

      expect(mockFetch).not.toHaveBeenCalled();
      expect(localStorageMock.getItem('affiliate_clicks')).not.toBeNull();
    });
  });

  describe('trackArticleEngagement', () => {
    it('should call gtag event for article engagement', () => {
      process.env.NEXT_PUBLIC_GA_ID = 'G-TESTID';
      Object.defineProperty(require('../../lib/analytics'), 'ANALYTICS_ENABLED', { value: true });
      trackArticleEngagement('article-1', 'category-a', 'start_reading');
      expect(mockGtag).toHaveBeenCalledWith('event', 'article_start_reading', {
        event_category: 'engagement',
        event_label: 'article-1',
        article_category: 'category-a',
        article_id: 'article-1',
      });
    });
  });

  describe('trackSearch', () => {
    it('should call gtag event for search behavior', () => {
      process.env.NEXT_PUBLIC_GA_ID = 'G-TESTID';
      Object.defineProperty(require('../../lib/analytics'), 'ANALYTICS_ENABLED', { value: true });
      trackSearch('test query', 5, 'jobs');
      expect(mockGtag).toHaveBeenCalledWith('event', 'search', {
        event_category: 'site_search',
        event_label: 'test query',
        value: 5,
        search_category: 'jobs',
      });
    });
  });
});

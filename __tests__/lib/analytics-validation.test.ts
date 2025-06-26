import { validateGoogleAnalyticsId, checkAnalyticsHealth, logAnalyticsEnvironment } from '../../lib/analytics-validation';

describe('validateGoogleAnalyticsId', () => {
  it('should return true for a valid GA4 ID', () => {
    expect(validateGoogleAnalyticsId('G-XXXXXXXXXX')).toBe(true);
  });

  it('should return false for an invalid GA4 ID (wrong prefix)', () => {
    expect(validateGoogleAnalyticsId('UA-XXXXXXXXX')).toBe(false);
  });

  it('should return false for an invalid GA4 ID (wrong length)', () => {
    expect(validateGoogleAnalyticsId('G-XXXXXXXXX')).toBe(false);
  });

  it('should return false for an empty string', () => {
    expect(validateGoogleAnalyticsId('')).toBe(false);
  });

  it('should return false for a non-string input', () => {
    // @ts-ignore
    expect(validateGoogleAnalyticsId(123)).toBe(false);
  });
});

describe('checkAnalyticsHealth', () => {
  const mockFetch = jest.spyOn(global, 'fetch');

  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should return isValid: true and isReachable: true for a valid ID and reachable script', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true } as Response);

    const result = await checkAnalyticsHealth('G-VALIDID123');
    expect(result).toEqual({
      isValid: true,
      isReachable: true,
    });
    expect(mockFetch).toHaveBeenCalledWith(
      'https://www.googletagmanager.com/gtag/js?id=G-VALIDID123',
      { method: 'HEAD', mode: 'no-cors' }
    );
  });

  it('should return isValid: false for an invalid ID format', async () => {
    const result = await checkAnalyticsHealth('INVALID-ID');
    expect(result).toEqual({
      isValid: false,
      isReachable: false,
      error: 'Invalid Google Analytics ID format: INVALID-ID',
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should return isValid: true and isReachable: false if script is not reachable', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await checkAnalyticsHealth('G-VALIDID123');
    expect(result).toEqual({
      isValid: true,
      isReachable: false,
      error: 'Could not verify reachability: Error: Network error',
    });
  });

  it('should handle general errors during health check', async () => {
    mockFetch.mockImplementationOnce(() => {
      throw new Error('Unexpected error');
    });

    const result = await checkAnalyticsHealth('G-VALIDID123');
    expect(result).toEqual({
      isValid: false,
      isReachable: false,
      error: 'Health check failed: Error: Unexpected error',
    });
  });
});

describe('logAnalyticsEnvironment', () => {
  let consoleSpy: jest.SpyInstance;
  const originalEnv = process.env;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    process.env = originalEnv;
  });

  it('should log environment info with valid ID', () => {
    process.env.NEXT_PUBLIC_GA_ID = 'G-TESTID123';
    process.env.NODE_ENV = 'development';
    process.env.VERCEL_ENV = 'development';
    process.env.NEXT_PUBLIC_ANALYTICS_DEBUG = 'true';

    const info = logAnalyticsEnvironment();

    expect(consoleSpy).toHaveBeenCalledWith(
      '🔍 Analytics Environment Info:',
      expect.objectContaining({
        trackingId: 'G-TESTID123',
        environment: 'development',
        vercelEnv: 'development',
        debugMode: 'true',
      })
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      '📊 Analytics ID Format: ✅ Valid'
    );
    expect(info).toEqual(expect.objectContaining({
      trackingId: 'G-TESTID123',
      environment: 'development',
      vercelEnv: 'development',
      debugMode: 'true',
    }));
  });

  it('should log environment info with invalid ID', () => {
    process.env.NEXT_PUBLIC_GA_ID = 'INVALID';

    logAnalyticsEnvironment();

    expect(consoleSpy).toHaveBeenCalledWith(
      '📊 Analytics ID Format: ❌ Invalid'
    );
  });

  it('should log environment info when no ID is present', () => {
    delete process.env.NEXT_PUBLIC_GA_ID;

    logAnalyticsEnvironment();

    expect(consoleSpy).toHaveBeenCalledWith(
      '🔍 Analytics Environment Info:',
      expect.objectContaining({
        trackingId: undefined,
      })
    );
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('📊 Analytics ID Format:')
    );
  });
});

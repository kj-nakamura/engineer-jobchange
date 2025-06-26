import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../pages/api/analytics';

// Mock Next.js API request and response objects
const mockRequest = (method: string, body?: any) => ({
  method,
  body,
} as NextApiRequest);

const mockResponse = () => {
  const res: Partial<NextApiResponse> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res as NextApiResponse;
};

describe('/api/analytics', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    // Spy on console.log and console.error to prevent them from cluttering test output
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    jest.restoreAllMocks();
  });

  it('should return 405 for non-POST requests', async () => {
    const req = mockRequest('GET');
    const res = mockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ message: 'Method not allowed' });
  });

  it('should return 400 for invalid data format (missing clicks)', async () => {
    const req = mockRequest('POST', {});
    const res = mockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid data format' });
  });

  it('should return 400 for invalid data format (clicks not an array)', async () => {
    const req = mockRequest('POST', { clicks: 'not an array' });
    const res = mockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid data format' });
  });

  it('should process valid analytics data and return 200', async () => {
    const mockClicks = [
      {
        timestamp: new Date().toISOString(),
        affiliate_id: 'aff1',
        affiliate_url: 'http://example.com/aff1',
        service_name: 'Service A',
        placement: 'top',
        userAgent: 'test-agent',
        referrer: 'http://referrer.com',
        sessionId: 'session123',
        userId: 'user456',
      },
      {
        timestamp: new Date().toISOString(),
        affiliate_id: 'aff2',
        affiliate_url: 'http://example.com/aff2',
        service_name: 'Service B',
        placement: 'middle',
        article_category: 'guides',
        article_id: 'guide-1',
        userAgent: 'test-agent',
        referrer: 'http://referrer.com',
        sessionId: 'session123',
        userId: 'user456',
      },
    ];

    const req = mockRequest('POST', { clicks: mockClicks });
    const res = mockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Analytics data processed successfully',
        summary: expect.objectContaining({
          total_clicks: 2,
          services: expect.arrayContaining(['Service A', 'Service B']),
          placements: expect.arrayContaining(['top', 'middle']),
          articles: expect.arrayContaining(['guide-1']),
        }),
      })
    );
    expect(consoleSpy).toHaveBeenCalledWith('Analytics data received:', expect.any(Object));
  });

  it('should return 500 for internal server errors', async () => {
    // Simulate an error by passing a non-object to req.body.clicks
    const req = mockRequest('POST', { clicks: null }); // This will cause an error when destructuring
    const res = mockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});

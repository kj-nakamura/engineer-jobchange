import { NextApiRequest, NextApiResponse } from 'next';

interface AnalyticsData {
  timestamp: string;
  affiliate_id: string;
  affiliate_url: string;
  service_name: string;
  placement: string;
  article_category?: string;
  article_id?: string;
  userAgent: string;
  referrer: string;
  sessionId: string;
  userId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { clicks }: { clicks: AnalyticsData[] } = req.body;

    if (!clicks || !Array.isArray(clicks)) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    // ここで実際のデータベースやログファイルに保存
    // 現在はコンソールにログ出力のみ
    console.log('Analytics data received:', {
      count: clicks.length,
      timestamp: new Date().toISOString(),
      data: clicks
    });
    
    // 基本的な分析データを生成
    const servicesSet = new Set(clicks.map(c => c.service_name));
    const placementsSet = new Set(clicks.map(c => c.placement));
    const articlesSet = new Set(clicks.filter(c => c.article_id).map(c => c.article_id));
    
    const analytics = {
      total_clicks: clicks.length,
      services: Array.from(servicesSet),
      placements: Array.from(placementsSet),
      articles: Array.from(articlesSet),
      timestamp: new Date().toISOString()
    };

    // 実際の実装では、データベースに保存
    // await saveToDatabase(clicks);
    
    // 外部アナリティクスサービスに送信
    // await sendToExternalService(analytics);

    res.status(200).json({ 
      message: 'Analytics data processed successfully',
      summary: analytics
    });
  } catch (error) {
    console.error('Analytics processing error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
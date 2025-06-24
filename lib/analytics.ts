// Google Analytics 4 configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Custom event types for tracking
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// Enhanced ecommerce events for affiliate tracking
export interface AffiliateEvent {
  affiliate_id: string;
  affiliate_url: string;
  service_name: string;
  placement: string; // 'article_inline', 'sidebar', 'comparison_table', etc.
  article_category?: string;
  article_id?: string;
}

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: any
    ) => void;
  }
}

// Log the pageview with Google Analytics
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    });
  }
};

// Log specific events happening on the page
export const event = ({ action, category, label, value, custom_parameters }: AnalyticsEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...custom_parameters,
    });
  }
};

// Specific affiliate click tracking
export const trackAffiliateClick = (data: AffiliateEvent) => {
  // Google Analytics event
  event({
    action: 'affiliate_click',
    category: 'affiliate',
    label: data.service_name,
    custom_parameters: {
      affiliate_id: data.affiliate_id,
      affiliate_url: data.affiliate_url,
      placement: data.placement,
      article_category: data.article_category,
      article_id: data.article_id,
    }
  });

  // Custom tracking for revenue attribution
  if (typeof window !== 'undefined') {
    try {
      const trackingData = {
        timestamp: new Date().toISOString(),
        ...data,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        sessionId: getSessionId(),
        userId: getUserId(),
      };
      
      // Store for batch processing
      const existingData = localStorage.getItem('affiliate_clicks');
      const clicks = existingData ? JSON.parse(existingData) : [];
      clicks.push(trackingData);
      localStorage.setItem('affiliate_clicks', JSON.stringify(clicks));

      // Send to our analytics endpoint (batch every 10 clicks or 5 minutes)
      if (clicks.length >= 10) {
        sendAnalyticsData();
      }
    } catch (error) {
      console.warn('Failed to track affiliate click:', error);
    }
  }
};

// Track article engagement
export const trackArticleEngagement = (articleId: string, category: string, action: 'start_reading' | 'scroll_50' | 'scroll_100' | 'cta_view') => {
  event({
    action: `article_${action}`,
    category: 'engagement',
    label: articleId,
    custom_parameters: {
      article_category: category,
      article_id: articleId,
    }
  });
};

// Track search behavior
export const trackSearch = (query: string, results_count: number, category?: string) => {
  event({
    action: 'search',
    category: 'site_search',
    label: query,
    value: results_count,
    custom_parameters: {
      search_category: category,
    }
  });
};

// Helper functions for session and user tracking
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

function getUserId(): string {
  if (typeof window === 'undefined') return '';
  
  let userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('user_id', userId);
  }
  return userId;
}

// Send accumulated analytics data to our endpoint
async function sendAnalyticsData() {
  if (typeof window === 'undefined') return;

  try {
    const data = localStorage.getItem('affiliate_clicks');
    if (!data) return;

    const clicks = JSON.parse(data);
    if (clicks.length === 0) return;

    // Send to analytics API endpoint
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clicks })
    });
    
    if (response.ok) {
      console.log('Analytics data sent successfully');
      // Clear the stored data after successful sending
      localStorage.removeItem('affiliate_clicks');
    } else {
      console.warn('Failed to send analytics data:', response.statusText);
    }
    
  } catch (error) {
    console.warn('Failed to send analytics data:', error);
  }
}

// Set up periodic sending of analytics data
if (typeof window !== 'undefined') {
  // Send data every 5 minutes
  setInterval(sendAnalyticsData, 5 * 60 * 1000);
  
  // Send data before page unload
  window.addEventListener('beforeunload', sendAnalyticsData);
}